"""Test login functionality to debug the issue."""
import sys
sys.path.insert(0, 'C:\\Users\\Mored\\CleverStudy\\backend')

from repository.user_repository import UserRepository
from auth import verify_password

# Get the user
repo = UserRepository()
user = repo.find_by_email('mored321@hotmail.com')

if user:
    print(f'User found: {user.email}')
    print(f'User ID: {user.id}')
    print(f'Password hash length: {len(user.password_hash)}')
    print(f'Password hash preview: {user.password_hash[:30]}...')
    print()
    
    # Test password verification with common test passwords
    test_passwords = ['test', 'Test1234', 'Password123', 'mored321', 'Mored321']
    print('Testing password verification:')
    for pwd in test_passwords:
        result = verify_password(pwd, user.password_hash)
        print(f'  "{pwd}": {"✅ Match" if result else "❌ No match"}')
else:
    print('❌ User not found!')
