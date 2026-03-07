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
    # Limit text to 30k chars
    context = text[:30000]
    
    prompt = f"""Analyze the following educational document.
    1. Extract 6-8 key topics as a JSON list.
    2. Generate 10 multiple-choice questions as a JSON list.
    
    Format:
    {{
        "topics": ["Topic 1", "Topic 2"],
        "questions": [
            {{
                "id": "1",
                "text": "Question?",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 0,
                "explanation": "Why correct"
            }}
        ]
    }}
    
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
    context = document_text[:30000]
    
    history_str = ""
    if history:
        for msg in history:
            role = "Student" if msg['role'] == 'user' else "Assistant"
            history_str += f"{role}: {msg['parts']}\n"

    system_prompt = f"""You are a study assistant. ONLY answer based on the document below.
    If unreachable, say: "I can only help with questions related to your study document."
    
    Document:
    {context}
    
    Conversation History:
    {history_str}
    
    Student: {user_message}
    Assistant:"""
    
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

