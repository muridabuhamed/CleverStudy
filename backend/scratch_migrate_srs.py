import sqlite3
import os

_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
DB_PATH = os.path.join(_DATA_DIR, 'smart_study_platform.db')

def migrate():
    print(f"Connecting to {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("PRAGMA table_info(flashcards)")
        columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        if 'next_review_at' not in columns:
            print("Adding next_review_at...")
            cursor.execute('ALTER TABLE flashcards ADD COLUMN next_review_at DATETIME DEFAULT "2024-01-01 00:00:00"')
        if 'interval' not in columns:
            print("Adding interval...")
            cursor.execute('ALTER TABLE flashcards ADD COLUMN interval INTEGER DEFAULT 0')
        if 'ease_factor' not in columns:
            print("Adding ease_factor...")
            cursor.execute('ALTER TABLE flashcards ADD COLUMN ease_factor FLOAT DEFAULT 2.5')
        if 'repetitions' not in columns:
            print("Adding repetitions...")
            cursor.execute('ALTER TABLE flashcards ADD COLUMN repetitions INTEGER DEFAULT 0')
        
        conn.commit()
        print("✓ Migration successful!")
        
        # Verify
        cursor.execute("PRAGMA table_info(flashcards)")
        new_columns = [column[1] for column in cursor.fetchall()]
        print(f"New columns: {new_columns}")
        
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
