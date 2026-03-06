import sqlite3
import json
import os
from typing import List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'smart_study_platform.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            topics TEXT,
            questions TEXT,
            status TEXT DEFAULT 'pending'
        )
    ''')
    conn.commit()
    conn.close()

def add_file_record(file_id: str, filename: str, original_name: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO files (id, filename, original_name) VALUES (?, ?, ?)',
        (file_id, filename, original_name)
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
