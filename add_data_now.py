import sqlite3
import json
from datetime import datetime, timedelta
import uuid
from pathlib import Path

# Use the logged-in Test User's ID
LOGGED_IN_USER_ID = "d5bb35b9-d86c-420b-827f-5da768c776d2"
DB_PATH = "data/smart_study_platform.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("📝 Adding test data for the logged-in Test User...")

try:
    # Check if already has data
    cursor.execute('SELECT COUNT(*) FROM quiz_attempts WHERE user_id = ?', (LOGGED_IN_USER_ID,))
    if cursor.fetchone()[0] > 0:
        print("🔄 User has existing data. Clearing and refreshing...")
        cursor.execute('DELETE FROM quiz_attempts WHERE user_id = ?', (LOGGED_IN_USER_ID,))
        cursor.execute('DELETE FROM study_sessions WHERE user_id = ?', (LOGGED_IN_USER_ID,))
        cursor.execute('DELETE FROM files WHERE user_id = ?', (LOGGED_IN_USER_ID,))
    
    # Add test files
    file_ids = []
    for i in range(3):
        file_id = str(uuid.uuid4())
        file_ids.append(file_id)
        created_at = (datetime.now() - timedelta(days=i*2)).isoformat()
        
        cursor.execute('''
            INSERT INTO files (id, user_id, filename, original_name, status, created_at, topics, questions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            file_id,
            LOGGED_IN_USER_ID,
            f'test_document_{i+1}.pdf',
            f'Python Guide Vol {i+1}.pdf',
            'completed',
            created_at,
            json.dumps(['Python', 'Programming', f'Chapter {i+1}']),
            json.dumps([])
        ))
    print(f"✅ 3 Files added")
    
    # Add test quiz attempts
    for i in range(5):
        attempt_id = str(uuid.uuid4())
        score = 75 + (i * 3)  # Increasing scores: 75, 78, 81, 84, 87
        total = 10
        file_id = file_ids[i % len(file_ids)]
        completed_at = (datetime.now() - timedelta(hours=i*6)).isoformat()
        
        cursor.execute('''
            INSERT INTO quiz_attempts (id, user_id, file_id, score, total, completed_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            attempt_id,
            LOGGED_IN_USER_ID,
            file_id,
            score,
            total,
            completed_at
        ))
    print(f"✅ 5 Quiz attempts (average: 81%)")
    
    # Add test study sessions
    total_seconds = 0
    for i in range(7):
        session_id = str(uuid.uuid4())
        duration = 900 + (i * 300)  # 15-45 minutes
        total_seconds += duration
        file_id = file_ids[i % len(file_ids)]
        started_at = (datetime.now() - timedelta(hours=i*2)).isoformat()
        
        cursor.execute('''
            INSERT INTO study_sessions (id, user_id, file_id, duration_seconds, started_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            session_id,
            LOGGED_IN_USER_ID,
            file_id,
            duration,
            started_at
        ))
    
    print(f"✅ 7 Study sessions ({total_seconds // 60} minutes)")
    
    conn.commit()
    print("\n✨ Test data added successfully!")
    print("\n👉 Refresh your browser to see the updated profile!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    conn.rollback()
finally:
    conn.close()
