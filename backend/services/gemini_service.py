import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from the root directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(ROOT_DIR, '.env.local'))
load_dotenv(os.path.join(ROOT_DIR, '.env'))

# Primary model first, fallback if quota is exceeded
_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash']

def _is_quota_error(e: Exception) -> bool:
    msg = str(e)
    return '429' in msg or 'quota' in msg.lower() or 'rate limit' in msg.lower()

def _get_model(model_name: str):
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name)

def _generate(prompt: str) -> str:
    """Try each model in order, falling back on quota errors."""
    last_error = None
    for model_name in _MODELS:
        try:
            model = _get_model(model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            if _is_quota_error(e):
                last_error = e
                continue
            raise
    raise last_error

async def analyze_document(text: str) -> Dict[str, Any]:
    """
    Analyze document with optimizations:
    - Reduced text limit (20k instead of 30k) for faster processing
    - Fewer questions (8 instead of 10) for speed
    - Concise prompt for faster AI response
    """
    # Limit text to 20k chars for faster processing
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
    
    raw = _generate(prompt)
    try:
        json_str = raw.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()
        elif json_str.startswith("```"):
            json_str = json_str[3:-3].strip()
        return json.loads(json_str)
    except Exception as e:
        print(f"Failed to parse AI response: {e}")
        return {"topics": [], "questions": []}

async def chat_with_document(document_text: str, user_message: str, history: List[Dict[str, str]] = None) -> str:
    """
    Chat with optimizations:
    - Reduced context (15k instead of 30k) for faster responses
    - Limited history (last 4 messages only)
    - Concise system prompt
    """
    # Reduced for faster responses
    context = document_text[:15000]
    
    history_str = ""
    if history:
        # Only use last 4 messages to keep context manageable
        recent_history = history[-4:] if len(history) > 4 else history
        for msg in recent_history:
            role = "Q" if msg['role'] == 'user' else "A"
            history_str += f"{role}: {msg['parts'][:200]}\n"  # Limit message length

    system_prompt = f"""Answer based on this document. Keep responses concise.

Document:
{context}

{history_str}

Q: {user_message}
A:"""
    
    return _generate(system_prompt)

async def generate_flashcards(text: str, count: int = 15) -> List[Dict[str, str]]:
    """Generate flashcards from document text"""
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
    
    json_str = _generate(prompt).strip()
    
    if json_str.startswith("```json"):
        json_str = json_str[7:-3].strip()
    elif json_str.startswith("```"):
        json_str = json_str[3:-3].strip()
    
    flashcards = json.loads(json_str)
    
    if isinstance(flashcards, list) and len(flashcards) > 0:
        return flashcards[:count]
    return []

