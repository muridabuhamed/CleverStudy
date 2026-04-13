"""Reset user password for testing."""
import sys
sys.path.insert(0, 'C:\\Users\\Mored\\CleverStudy\\backend')

from repository.user_repository import UserRepository
from auth import get_password_hash
import sqlite3

# New test password
NEW_PASSWORD = "Test1234"
USER_EMAIL = "mored321@hotmail.com"

print(f"Resetting password for {USER_EMAIL}...")
print(f"New password: {NEW_PASSWORD}")
print()

# Hash the new password
new_hash = get_password_hash(NEW_PASSWORD)
print(f"New hash: {new_hash[:40]}...")

# Update in database
db_path = 'C:\\Users\\Mored\\CleverStudy\\data\\smart_study_platform.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute(
    "UPDATE users SET password_hash = ? WHERE email = ?",
    (new_hash, USER_EMAIL)
)
conn.commit()
affected = cursor.rowcount
conn.close()

if affected > 0:
    print()
    print("✅ Password reset successfully!")
    print()
    print("Login credentials:")
    print(f"  Email: {USER_EMAIL}")  
    print(f"  Password: {NEW_PASSWORD}")
else:
    print("❌ User not found!")
