import sqlite3
import json
import os
from typing import List, Optional

_DATA_DIR = os.getenv('DATA_DIR', os.path.join(os.path.dirname(__file__), '..', 'data'))
DB_PATH = os.path.join(_DATA_DIR, 'smart_study_platform.db')

def init_db():
    os.makedirs(_DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Files table with user_id
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            topics TEXT,
            questions TEXT,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Quiz attempts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            file_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (file_id) REFERENCES files(id)
        )
    ''')
    
    # Flashcards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flashcards (
            id TEXT PRIMARY KEY,
            file_id TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (file_id) REFERENCES files(id)
        )
    ''')
    
    # Flashcard reviews table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flashcard_reviews (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            flashcard_id TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (flashcard_id) REFERENCES flashcards(id)
        )
    ''')
    
    # Highlights table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS highlights (
            id TEXT PRIMARY KEY,
            file_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            page_number INTEGER NOT NULL,
            text_content TEXT NOT NULL,
            color TEXT DEFAULT '#FFFF00',
            position_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (file_id) REFERENCES files(id)
        )
    ''')
    
    # Annotations (notes) table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS annotations (
            id TEXT PRIMARY KEY,
            file_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            page_number INTEGER NOT NULL,
            note_text TEXT NOT NULL,
            position_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (file_id) REFERENCES files(id)
        )
    ''')
    
    # Bookmarks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookmarks (
            id TEXT PRIMARY KEY,
            file_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            page_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (file_id) REFERENCES files(id)
        )
    ''')
    
    conn.commit()
    conn.close()

def add_file_record(file_id: str, filename: str, original_name: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO files (id, filename, original_name, user_id) VALUES (?, ?, ?, ?)',
        (file_id, filename, original_name, user_id)
    )
    conn.commit()
    conn.close()

def update_file_analysis(file_id: str, topics: List[str], questions: List[dict]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE files SET topics = ?, questions = ?, status = ? WHERE id = ?',
        (json.dumps(topics), json.dumps(questions), 'completed', file_id)
    )
    conn.commit()
    conn.close()

def get_all_files():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files ORDER BY created_at DESC')
    rows = cursor.fetchall()
    
    files = []
    for row in rows:
        file_dict = dict(row)
        file_dict['topics'] = json.loads(row['topics']) if row['topics'] else []
        file_dict['questions'] = json.loads(row['questions']) if row['questions'] else []
        files.append(file_dict)
        
    conn.close()
    return files

def delete_file_record(file_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM files WHERE id = ?', (file_id,))
    conn.commit()
    conn.close()

# User operations
def create_user(user_id: str, email: str, password_hash: str, name: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
        (user_id, email, password_hash, name)
    )
    conn.commit()
    conn.close()

def get_user_by_email(email: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_users():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# File operations by user
def get_files_by_user(user_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    rows = cursor.fetchall()
    
    files = []
    for row in rows:
        file_dict = dict(row)
        file_dict['topics'] = json.loads(row['topics']) if row['topics'] else []
        file_dict['questions'] = json.loads(row['questions']) if row['questions'] else []
        files.append(file_dict)
        
    conn.close()
    return files

def get_file_by_id(file_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM files WHERE id = ?', (file_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        file_dict = dict(row)
        file_dict['topics'] = json.loads(row['topics']) if row['topics'] else []
        file_dict['questions'] = json.loads(row['questions']) if row['questions'] else []
        return file_dict
    return None

# Quiz attempts
def add_quiz_attempt(attempt_id: str, user_id: str, file_id: str, score: int, total: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO quiz_attempts (id, user_id, file_id, score, total) VALUES (?, ?, ?, ?, ?)',
        (attempt_id, user_id, file_id, score, total)
    )
    conn.commit()
    conn.close()

def get_user_stats(user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            COUNT(DISTINCT file_id) as files_studied,
            COUNT(*) as quizzes_taken,
            AVG(CAST(score AS FLOAT) / total * 100) as avg_score,
            SUM(score) as total_correct,
            SUM(total) as total_questions
        FROM quiz_attempts 
        WHERE user_id = ?
    ''', (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            'files_studied': row[0] or 0,
            'quizzes_taken': row[1] or 0,
            'avg_score': row[2] or 0,
            'total_correct': row[3] or 0,
            'total_questions': row[4] or 0
        }
    return {
        'files_studied': 0,
        'quizzes_taken': 0,
        'avg_score': 0,
        'total_correct': 0,
        'total_questions': 0
    }

def get_recent_attempts(user_id: str, limit: int = 10):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('''
        SELECT qa.*, f.original_name as file_name
        FROM quiz_attempts qa
        JOIN files f ON qa.file_id = f.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
        LIMIT ?
    ''', (user_id, limit))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Flashcard operations
def add_flashcards(flashcards: List[dict]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for fc in flashcards:
        cursor.execute(
            'INSERT INTO flashcards (id, file_id, question, answer) VALUES (?, ?, ?, ?)',
            (fc['id'], fc['file_id'], fc['question'], fc['answer'])
        )
    conn.commit()
    conn.close()

def get_flashcards_by_file(file_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM flashcards WHERE file_id = ? ORDER BY created_at', (file_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_flashcard_by_id(flashcard_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM flashcards WHERE id = ?', (flashcard_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def add_flashcard_review(review_id: str, user_id: str, flashcard_id: str, difficulty: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO flashcard_reviews (id, user_id, flashcard_id, difficulty) VALUES (?, ?, ?, ?)',
        (review_id, user_id, flashcard_id, difficulty)
    )
    conn.commit()
    conn.close()

def get_flashcard_stats(user_id: str, file_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            f.id,
            f.question,
            f.answer,
            COUNT(fr.id) as review_count,
            MAX(fr.difficulty) as last_difficulty,
            MAX(fr.reviewed_at) as last_reviewed
        FROM flashcards f
        LEFT JOIN flashcard_reviews fr ON f.id = fr.flashcard_id AND fr.user_id = ?
        WHERE f.file_id = ?
        GROUP BY f.id, f.question, f.answer
        ORDER BY f.created_at
    ''', (user_id, file_id))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Highlight operations
def add_highlight(highlight_id: str, file_id: str, user_id: str, page_number: int, 
                  text_content: str, color: str, position_data: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO highlights (id, file_id, user_id, page_number, text_content, color, position_data) 
           VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (highlight_id, file_id, user_id, page_number, text_content, color, position_data)
    )
    conn.commit()
    conn.close()

def get_highlights_by_file(file_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM highlights WHERE file_id = ? AND user_id = ? ORDER BY page_number, created_at',
        (file_id, user_id)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_highlight(highlight_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM highlights WHERE id = ? AND user_id = ?', (highlight_id, user_id))
    conn.commit()
    conn.close()

# Annotation (notes) operations
def add_annotation(annotation_id: str, file_id: str, user_id: str, page_number: int, 
                   note_text: str, position_data: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO annotations (id, file_id, user_id, page_number, note_text, position_data) 
           VALUES (?, ?, ?, ?, ?, ?)''',
        (annotation_id, file_id, user_id, page_number, note_text, position_data)
    )
    conn.commit()
    conn.close()

def get_annotations_by_file(file_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM annotations WHERE file_id = ? AND user_id = ? ORDER BY page_number, created_at',
        (file_id, user_id)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def update_annotation(annotation_id: str, user_id: str, note_text: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE annotations SET note_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        (note_text, annotation_id, user_id)
    )
    conn.commit()
    conn.close()

def delete_annotation(annotation_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM annotations WHERE id = ? AND user_id = ?', (annotation_id, user_id))
    conn.commit()
    conn.close()

# Bookmark operations
def add_bookmark(bookmark_id: str, file_id: str, user_id: str, page_number: int, title: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO bookmarks (id, file_id, user_id, page_number, title) VALUES (?, ?, ?, ?, ?)',
        (bookmark_id, file_id, user_id, page_number, title)
    )
    conn.commit()
    conn.close()

def get_bookmarks_by_file(file_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM bookmarks WHERE file_id = ? AND user_id = ? ORDER BY page_number',
        (file_id, user_id)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_bookmark(bookmark_id: str, user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM bookmarks WHERE id = ? AND user_id = ?', (bookmark_id, user_id))
    conn.commit()
    conn.close()

# Search annotations across all content
def search_annotations(user_id: str, query: str, file_id: Optional[str] = None):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    results = []
    
    # Search highlights
    if file_id:
        cursor.execute('''
            SELECT h.*, f.original_name as file_name, 'highlight' as type
            FROM highlights h
            JOIN files f ON h.file_id = f.id
            WHERE h.user_id = ? AND h.file_id = ? AND h.text_content LIKE ?
            ORDER BY h.created_at DESC
        ''', (user_id, file_id, f'%{query}%'))
    else:
        cursor.execute('''
            SELECT h.*, f.original_name as file_name, 'highlight' as type
            FROM highlights h
            JOIN files f ON h.file_id = f.id
            WHERE h.user_id = ? AND h.text_content LIKE ?
            ORDER BY h.created_at DESC
        ''', (user_id, f'%{query}%'))
    results.extend([dict(row) for row in cursor.fetchall()])
    
    # Search annotations
    if file_id:
        cursor.execute('''
            SELECT a.*, f.original_name as file_name, 'annotation' as type
            FROM annotations a
            JOIN files f ON a.file_id = f.id
            WHERE a.user_id = ? AND a.file_id = ? AND a.note_text LIKE ?
            ORDER BY a.created_at DESC
        ''', (user_id, file_id, f'%{query}%'))
    else:
        cursor.execute('''
            SELECT a.*, f.original_name as file_name, 'annotation' as type
            FROM annotations a
            JOIN files f ON a.file_id = f.id
            WHERE a.user_id = ? AND a.note_text LIKE ?
            ORDER BY a.created_at DESC
        ''', (user_id, f'%{query}%'))
    results.extend([dict(row) for row in cursor.fetchall()])
    
    conn.close()
    return results
