import sqlite3

# Verify the data was added
LOGGED_IN_USER_ID = "d5bb35b9-d86c-420b-827f-5da768c776d2"
DB_PATH = "data/smart_study_platform.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM files WHERE user_id = ?', (LOGGED_IN_USER_ID,))
files_count = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM quiz_attempts WHERE user_id = ?', (LOGGED_IN_USER_ID,))
quizzes_count = cursor.fetchone()[0]

cursor.execute('SELECT SUM(duration_seconds) FROM study_sessions WHERE user_id = ?', (LOGGED_IN_USER_ID,))
study_seconds = cursor.fetchone()[0] or 0

cursor.execute('SELECT AVG(CAST(score AS FLOAT) / total * 100) FROM quiz_attempts WHERE user_id = ?', (LOGGED_IN_USER_ID,))
avg_score = cursor.fetchone()[0] or 0

conn.close()

print("\n📊 VERIFICATION: Test Data Added Successfully")
print("=" * 50)
print(f"Files Studied:        {files_count}")
print(f"Quizzes Taken:        {quizzes_count}")
print(f"Average Score:        {avg_score:.1f}%")
print(f"Total Study Time:     {study_seconds // 60} minutes")
print("=" * 50)
print("\n✨ Your profile should now display these stats!")
print("\n👉 Refresh your browser to see the updated Profile page")
