#!/usr/bin/env python3
"""
Script to add test data to the database for development/testing.
Run this to populate the database with sample user and activity data.
"""

import sqlite3
import json
from datetime import datetime, timedelta
import uuid
from pathlib import Path
import bcrypt

# Database path
DATA_DIR = Path(__file__).parent.parent / 'data'
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = DATA_DIR / 'smart_study_platform.db'

def add_test_data():
    """Add test data to the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create test user
    user_id = "test-user-001"
    test_email = "testuser@example.com"
    # Password "password" hashed with bcrypt
    test_password_hash = bcrypt.hashpw(b"password", bcrypt.gensalt()).decode()
    test_name = "Test User"
    
    print("📝 Adding test data...")
    
    try:
        # Check if user already has data
        cursor.execute('SELECT id FROM quiz_attempts WHERE user_id = ?', (user_id,))
        if cursor.fetchone():
            print(f"⚠️  Test user already has data. Skipping...")
            conn.close()
            return
        
        # Insert test user
        cursor.execute('''
            INSERT OR IGNORE INTO users (id, email, password_hash, name) 
            VALUES (?, ?, ?, ?)
        ''', (user_id, test_email, test_password_hash, test_name))
        print(f"✅ User: {test_email}")
        
        # Add test files
        file_ids = []
        for i in range(3):
            file_id = str(uuid.uuid4())
            file_ids.append(file_id)
            now = datetime.now()
            created_at = (now - timedelta(days=i*2)).isoformat()
            
            cursor.execute('''
                INSERT INTO files (id, user_id, filename, original_name, status, created_at, topics, questions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                file_id,
                user_id,
                f'test_document_{i+1}.pdf',
                f'Python Guide Vol {i+1}.pdf',
                'completed',
                created_at,
                json.dumps(['Python', 'Programming', f'Chapter {i+1}']),
                json.dumps([])
            ))
            print(f"  📄 File: Python Guide Vol {i+1}.pdf")
        
        # Add test quiz attempts
        for i in range(5):
            attempt_id = str(uuid.uuid4())
            score = 75 + (i * 3)  # Increasing scores: 75, 78, 81, 84, 87
            total = 10
            file_id = file_ids[i % len(file_ids)]
            now = datetime.now()
            completed_at = (now - timedelta(hours=i*6)).isoformat()
            
            cursor.execute('''
                INSERT INTO quiz_attempts (id, user_id, file_id, score, total, completed_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                attempt_id,
                user_id,
                file_id,
                score,
                total,
                completed_at
            ))
        print(f"✅ Quizzes: 5 attempts added (avg score: 81%)")
        
        # Add test study sessions
        total_study_seconds = 0
        for i in range(7):
            session_id = str(uuid.uuid4())
            duration = 900 + (i * 300)  # 15-45 minutes
            total_study_seconds += duration
            file_id = file_ids[i % len(file_ids)]
            now = datetime.now()
            started_at = (now - timedelta(hours=i*2)).isoformat()
            
            cursor.execute('''
                INSERT INTO study_sessions (id, user_id, file_id, duration_seconds, started_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                session_id,
                user_id,
                file_id,
                duration,
                started_at
            ))
        
        print(f"✅ Study Time: 7 sessions ({total_study_seconds // 60} minutes total)")
        
        conn.commit()
        print("\n✨ Test data added successfully!")
        print(f"\nYou can now:")
        print(f"  ✓ Refresh your browser")
        print(f"  ✓ Your profile should show stats!")
        
    except Exception as e:
        print(f"❌ Error adding test data: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    add_test_data()
