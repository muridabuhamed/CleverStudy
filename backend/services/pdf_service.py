from pypdf import PdfReader
import os

def extract_text_from_pdf(file_path: str, max_pages: int = 100) -> str:
    """
    Extract text from PDF with optimization:
    - Limit pages to avoid processing huge documents
    - Skip empty pages faster
    - Return immediately on errors
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    text = ""
    try:
        reader = PdfReader(file_path)
        num_pages = min(len(reader.pages), max_pages)  # Limit to first 100 pages
        
        for i in range(num_pages):
            page_text = reader.pages[i].extract_text()
            if page_text and page_text.strip():  # Skip empty pages
                text += page_text + "\n"
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""
