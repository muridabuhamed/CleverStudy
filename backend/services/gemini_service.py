import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from the root directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(ROOT_DIR, '.env.local'))
load_dotenv(os.path.join(ROOT_DIR, '.env'))

def get_genai_model():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: API key not found in environment")
        raise ValueError("API key environment variable is required")
    
    print(f"✅ API Key found: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-flash')

async def analyze_document(text: str) -> Dict[str, Any]:
    model = get_genai_model()
    
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
    
    response = model.generate_content(prompt)
    try:
        # Clean potential markdown markdown code blocks
        json_str = response.text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()
        elif json_str.startswith("```"):
            json_str = json_str[3:-3].strip()
        
        return json.loads(json_str)
    except Exception as e:
        print(f"Failed to parse AI response: {e}")
        return {"topics": [], "questions": []}

async def chat_with_document(document_text: str, user_message: str, history: List[Dict[str, str]] = None) -> str:
    model = get_genai_model()
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
    
    try:
        response = model.generate_content(system_prompt)
        return response.text
    except Exception as e:
        print(f"❌ Chat Error: {e}")
        return f"Error: {e}"
