"""
Gemini AI client.

This module provides a clean interface to Google Gemini AI for document analysis.
"""
import json
import google.generativeai as genai
from typing import List, Dict, Any

from core.config import get_settings
from core.exceptions import AIServiceError, AIQuotaExceededError
from core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class GeminiClient:
    """
    Client for Google Gemini AI services.
    
    Handles document analysis, chat, and flashcard generation with automatic
    fallback between models when quota is exceeded.
    """
    
    # Primary model first, fallback if quota exceeded
    MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash']
    
    def __init__(self):
        """Initialize Gemini client with API key."""
        if not settings.GEMINI_API_KEY:
            raise AIServiceError("GEMINI_API_KEY is not configured")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("Gemini client initialized")
    
    def _is_quota_error(self, error: Exception) -> bool:
        """
        Check if error is a quota/rate limit error.
        
        Args:
            error: Exception to check
            
        Returns:
            True if quota error
        """
        msg = str(error).lower()
        return '429' in msg or 'quota' in msg or 'rate limit' in msg

    def _is_api_key_error(self, error: Exception) -> bool:
        """Check if error indicates an invalid/misconfigured API key."""
        msg = str(error).lower()
        return (
            'api_key_invalid' in msg
            or 'api key not valid' in msg
            or 'invalid api key' in msg
            or 'permission denied' in msg
        )
    
    def _generate(self, prompt: str) -> str:
        """
        Generate content with automatic model fallback.
        
        Tries each model in order, falling back on quota errors.
        
        Args:
            prompt: Generation prompt
            
        Returns:
            Generated text
            
        Raises:
            AIQuotaExceededError: If all models are quota-limited
            AIServiceError: If generation fails
        """
        last_error = None
        
        for model_name in self.MODELS:
            try:
                logger.debug(f"Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                
                logger.info(f"Successfully generated content with {model_name}")
                return response.text
                
            except Exception as e:
                if self._is_api_key_error(e):
                    logger.error(f"Invalid Gemini API key for {model_name}: {e}")
                    raise AIServiceError(
                        "Invalid Gemini API key. Update GEMINI_API_KEY in .env.local and restart backend."
                    )

                if self._is_quota_error(e):
                    logger.warning(f"Quota exceeded for {model_name}: {e}")
                    last_error = e
                    continue
                
                logger.error(f"Generation failed with {model_name}: {e}", exc_info=True)
                raise AIServiceError(f"AI generation failed: {str(e)}")
        
        # All models failed with quota errors
        raise AIQuotaExceededError(
            "All AI models are quota-limited. Please try again later."
        )
    
    def _extract_json_from_response(self, response: str) -> Dict[str, Any]:
        """
        Extract JSON from AI response.
        
        Handles code blocks and formatting variations.
        
        Args:
            response: AI response text
            
        Returns:
            Parsed JSON object
            
        Raises:
            AIServiceError: If JSON extraction fails
        """
        try:
            json_str = response.strip()
            
            # Remove markdown code blocks if present
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.debug(f"Response was: {response[:500]}")
            raise AIServiceError(f"Invalid JSON response from AI: {str(e)}")
    
    def analyze_document(self, text: str) -> Dict[str, Any]:
        """
        Analyze document and extract topics and questions.
        
        Optimizations:
        - Limited to 20k chars for faster processing
        - Generates 8 questions for speed
        - Concise prompt
        
        Args:
            text: Document text
            
        Returns:
            Dictionary with 'topics' and 'questions' keys
            
        Raises:
            AIServiceError: If analysis fails
            AIQuotaExceededError: If quota exceeded
        """
        # Limit text for faster processing
        context = text[:20000]
        
        prompt = f"""Analyze this document. Return ONLY valid JSON:
{{
    "topics": ["topic1", "topic2", "topic3", "topic4", "topic5", "topic6"],
    "questions": [
        {{"id": "1", "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Brief"}}
    ]
}}

Generate 5-6 topics and 8 questions.

Document:
{context}

JSON:"""
        
        logger.info("Analyzing document with AI")
        raw_response = self._generate(prompt)
        
        try:
            result = self._extract_json_from_response(raw_response)
            
            # Validate response structure
            if not isinstance(result.get('topics'), list):
                logger.warning("Invalid topics in response, returning empty")
                result['topics'] = []
            
            if not isinstance(result.get('questions'), list):
                logger.warning("Invalid questions in response, returning empty")
                result['questions'] = []
            
            logger.info(
                f"Document analysis complete: {len(result['topics'])} topics, "
                f"{len(result['questions'])} questions"
            )
            
            return result
            
        except AIServiceError:
            # Return empty results on parsing error
            logger.error("Failed to parse document analysis response")
            return {"topics": [], "questions": []}
    
    def chat_with_document(
        self,
        document_text: str,
        user_message: str,
        history: List[Dict[str, str]] = None
    ) -> str:
        """
        Chat about a document.
        
        Optimizations:
        - Limited to 15k chars for faster responses
        - Only last 4 history messages
        - Concise system prompt
        
        Args:
            document_text: Full document text
            user_message: User's question
            history: Previous chat messages
            
        Returns:
            AI response
            
        Raises:
            AIServiceError: If chat fails
            AIQuotaExceededError: If quota exceeded
        """
        # Reduce context for speed
        context = document_text[:15000]
        
        # Build history string (last 4 messages only)
        history_str = ""
        if history:
            recent_history = history[-4:] if len(history) > 4 else history
            for msg in recent_history:
                role = "Q" if msg.get('role') == 'user' else "A"
                # Limit message length
                content = msg.get('parts', '')[:200]
                history_str += f"{role}: {content}\n"
        
        prompt = f"""Answer based on this document. Keep responses concise.

Document:
{context}

{history_str}

Q: {user_message}
A:"""
        
        logger.info(f"Chat query: {user_message[:100]}")
        response = self._generate(prompt)
        
        logger.debug(f"Chat response: {response[:200]}")
        
        return response
    
    def generate_flashcards(
        self,
        text: str,
        count: int = 15
    ) -> List[Dict[str, str]]:
        """
        Generate flashcards from document text.
        
        Args:
            text: Document text
            count: Number of flashcards to generate
            
        Returns:
            List of flashcards with 'question' and 'answer' keys
            
        Raises:
            AIServiceError: If generation fails
            AIQuotaExceededError: If quota exceeded
        """
        # Limit text
        context = text[:30000]
        
        prompt = f"""Generate {count} educational flashcards from this document.

Format as JSON array:
[
    {{
        "question": "What is X?",
        "answer": "X is..."
    }}
]

Rules:
- Questions should test key concepts
- Answers should be concise but complete
- Cover different topics from the document
- Make questions clear and specific

Document:
{context}

JSON Array:"""
        
        logger.info(f"Generating {count} flashcards")
        raw_response = self._generate(prompt)
        
        try:
            flashcards = self._extract_json_from_response(raw_response)
            
            # Ensure it's a list
            if not isinstance(flashcards, list):
                logger.warning("Invalid flashcard response format")
                return []
            
            # Validate and limit count
            valid_flashcards = []
            for card in flashcards[:count]:
                if isinstance(card, dict) and 'question' in card and 'answer' in card:
                    valid_flashcards.append(card)
            
            logger.info(f"Generated {len(valid_flashcards)} flashcards")
            
            return valid_flashcards
            
        except AIServiceError:
            logger.error("Failed to parse flashcard response")
            return []
