"""
Unit tests for UserRepository.

Tests the data access layer with an in-memory SQLite database.
"""
import pytest
import sqlite3
from datetime import datetime

from repository.user_repository import UserRepository
from domain.user import UserModel


@pytest.fixture
def in_memory_db():
    """Create an in-memory database for testing."""
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create related tables for stats
    cursor.execute('''
        CREATE TABLE files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            topics TEXT,
            questions TEXT,
            status TEXT DEFAULT 'pending',
            cached_text TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE quiz_attempts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            file_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    
    yield conn
    
    conn.close()


@pytest.fixture
def user_repository(in_memory_db, monkeypatch):
    """Create a UserRepository with in-memory database."""
    repo = UserRepository()
    
    # Monkey-patch the _get_connection method to use our in-memory DB
    original_get_connection = repo._get_connection
    
    def mock_get_connection():
        return in_memory_db
    
    monkeypatch.setattr(repo, '_get_connection', mock_get_connection)
    
    return repo


class TestUserRepository:
    """Test cases for UserRepository."""
    
    def test_create_user(self, user_repository):
        """Test creating a new user."""
        user = UserModel(
            id="user-123",
            email="test@example.com",
            password_hash="hashed_password",
            name="Test User",
            created_at=datetime.now()
        )
        
        created_user = user_repository.create(user)
        
        assert created_user is not None
        assert created_user.id == "user-123"
        assert created_user.email == "test@example.com"
        assert created_user.name == "Test User"
    
    def test_find_by_email(self, user_repository):
        """Test finding user by email."""
        # Create a user first
        user = UserModel(
            id="user-456",
            email="find@example.com",
            password_hash="hash123",
            name="Find Me",
            created_at=datetime.now()
        )
        user_repository.create(user)
        
        # Find by email
        found_user = user_repository.find_by_email("find@example.com")
        
        assert found_user is not None
        assert found_user.email == "find@example.com"
        assert found_user.id == "user-456"
    
    def test_find_by_email_not_found(self, user_repository):
        """Test finding non-existent email."""
        found_user = user_repository.find_by_email("nonexistent@example.com")
        
        assert found_user is None
    
    def test_email_exists(self, user_repository):
        """Test checking if email exists."""
        user = UserModel(
            id="user-789",
            email="exists@example.com",
            password_hash="hash456",
            name="Exists User",
            created_at=datetime.now()
        )
        user_repository.create(user)
        
        assert user_repository.email_exists("exists@example.com") is True
        assert user_repository.email_exists("notexists@example.com") is False
    
    def test_get_stats(self, user_repository, in_memory_db):
        """Test getting user statistics."""
        # Create user
        user = UserModel(
            id="user-stats",
            email="stats@example.com",
            password_hash="hash",
            name="Stats User",
            created_at=datetime.now()
        )
        user_repository.create(user)
        
        # Add some files and quiz attempts
        cursor = in_memory_db.cursor()
        
        cursor.execute(
            "INSERT INTO files (id, filename, original_name, user_id) VALUES (?, ?, ?, ?)",
            ("file-1", "test.pdf", "test.pdf", "user-stats")
        )
        cursor.execute(
            "INSERT INTO files (id, filename, original_name, user_id) VALUES (?, ?, ?, ?)",
            ("file-2", "test2.pdf", "test2.pdf", "user-stats")
        )
        
        cursor.execute(
            "INSERT INTO quiz_attempts (id, user_id, file_id, score, total) VALUES (?, ?, ?, ?, ?)",
            ("quiz-1", "user-stats", "file-1", 8, 10)
        )
        cursor.execute(
            "INSERT INTO quiz_attempts (id, user_id, file_id, score, total) VALUES (?, ?, ?, ?, ?)",
            ("quiz-2", "user-stats", "file-1", 9, 10)
        )
        
        in_memory_db.commit()
        
        # Get stats
        stats = user_repository.get_stats("user-stats")
        
        assert stats['total_files'] == 2
        assert stats['total_quizzes'] == 2
    
    def test_update_user(self, user_repository):
        """Test updating a user."""
        # Create user
        user = UserModel(
            id="user-update",
            email="update@example.com",
            password_hash="oldhash",
            name="Old Name",
            created_at=datetime.now()
        )
        user_repository.create(user)
        
        # Update user
        user.name = "New Name"
        user.password_hash = "newhash"
        
        updated_user = user_repository.update(user)
        
        assert updated_user.name == "New Name"
        assert updated_user.password_hash == "newhash"
        assert updated_user.email == "update@example.com"  # Unchanged
    
    def test_delete_user(self, user_repository):
        """Test deleting a user."""
        # Create user
        user = UserModel(
            id="user-delete",
            email="delete@example.com",
            password_hash="hash",
            name="Delete Me",
            created_at=datetime.now()
        )
        user_repository.create(user)
        
        # Verify user exists
        found = user_repository.find_by_id("user-delete")
        assert found is not None
        
        # Delete user
        user_repository.delete("user-delete")
        
        # Verify user is gone
        found_after = user_repository.find_by_id("user-delete")
        assert found_after is None
    
    def test_find_all_users(self, user_repository):
        """Test finding all users."""
        # Create multiple users
        for i in range(3):
            user = UserModel(
                id=f"user-all-{i}",
                email=f"user{i}@example.com",
                password_hash="hash",
                name=f"User {i}",
                created_at=datetime.now()
            )
            user_repository.create(user)
        
        # Find all
        all_users = user_repository.find_all()
        
        assert len(all_users) == 3
        assert all(isinstance(u, UserModel) for u in all_users)
