"""
Database migration script to add cached_text column
Run this once to update existing databases
"""
import sqlite3
import os

_DATA_DIR = os.getenv('DATA_DIR', os.path.join(os.path.dirname(__file__), '..', 'data'))
DB_PATH = os.path.join(_DATA_DIR, 'smart_study_platform.db')

def migrate():
    """Add cached_text column to files table if it doesn't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(files)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'cached_text' not in columns:
            print("Adding cached_text column to files table...")
            cursor.execute('ALTER TABLE files ADD COLUMN cached_text TEXT')
            conn.commit()
            print("✓ Migration completed successfully!")
        else:
            print("✓ cached_text column already exists. No migration needed.")
            
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
