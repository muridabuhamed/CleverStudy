"""
Unit tests for AuthService.

Tests the authentication business logic with mocked repositories.
"""
import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime
import jwt as pyjwt

from services.auth_service import AuthService
from domain.user import UserModel, UserCreate, UserLogin
from core.exceptions import (
    AuthenticationError,
    ValidationError,
    ResourceNotFoundError
)


@pytest.fixture
def mock_user_repository():
    """Create a mock user repository."""
    return Mock()


@pytest.fixture
def auth_service(mock_user_repository):
    """Create an AuthService with mocked repository."""
    return AuthService(mock_user_repository)


@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    return UserModel(
        id="user-123",
        email="test@example.com",
        password_hash="$2b$12$LQ9lFE0PQ8Y9Z/T0J9Z.0uP8L9Q0J9Z.0uP8L9Q0J9Z.0uP8L9Q",  # hashed "password123"
        name="Test User",
        created_at=datetime.now()
    )


class TestAuthService:
    """Test cases for AuthService."""
    
    def test_register_user_success(self, auth_service, mock_user_repository):
        """Test successful user registration."""
        # Mock: email doesn't exist
        mock_user_repository.email_exists.return_value = False
        mock_user_repository.create.return_value = UserModel(
            id="new-user",
            email="new@example.com",
            password_hash="hashed",
            name="New User",
            created_at=datetime.now()
        )
        
        user_data = UserCreate(
            email="new@example.com",
            password="Password123!",
            name="New User"
        )
        
        user, token = auth_service.register_user(user_data)
        
        assert user is not None
        assert user.email == "new@example.com"
        assert token is not None
        assert isinstance(token, str)
        
        # Verify repository was called
        mock_user_repository.email_exists.assert_called_once_with("new@example.com")
        mock_user_repository.create.assert_called_once()
    
    def test_register_user_email_exists(self, auth_service, mock_user_repository):
        """Test registration with existing email."""
        # Mock: email already exists
        mock_user_repository.email_exists.return_value = True
        
        user_data = UserCreate(
            email="existing@example.com",
            password="Password123!",
            name="Existing User"
        )
        
        with pytest.raises(ValidationError) as exc_info:
            auth_service.register_user(user_data)
        
        assert "already registered" in str(exc_info.value).lower()
    
    def test_login_user_success(self, auth_service, mock_user_repository, sample_user):
        """Test successful user login."""
        # Mock: user exists
        mock_user_repository.find_by_email.return_value = sample_user
        
        login_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        # Note: This will fail because the actual password hash doesn't match
        # In a real test, you'd need to use the actual bcrypt hash
        # For this example, we'll mock the verify_password method
        auth_service._verify_password = Mock(return_value=True)
        
        user, token = auth_service.login_user(login_data)
        
        assert user is not None
        assert user.email == "test@example.com"
        assert token is not None
    
    def test_login_user_not_found(self, auth_service, mock_user_repository):
        """Test login with non-existent user."""
        # Mock: user not found
        mock_user_repository.find_by_email.return_value = None
        
        login_data = UserLogin(
            email="nonexistent@example.com",
            password="password123"
        )
        
        with pytest.raises(AuthenticationError) as exc_info:
            auth_service.login_user(login_data)
        
        assert "invalid email or password" in str(exc_info.value).lower()
    
    def test_login_user_wrong_password(self, auth_service, mock_user_repository, sample_user):
        """Test login with wrong password."""
        # Mock: user exists
        mock_user_repository.find_by_email.return_value = sample_user
        
        login_data = UserLogin(
            email="test@example.com",
            password="wrongpassword"
        )
        
        auth_service._verify_password = Mock(return_value=False)
        
        with pytest.raises(AuthenticationError) as exc_info:
            auth_service.login_user(login_data)
        
        assert "invalid email or password" in str(exc_info.value).lower()
    
    def test_verify_token_success(self, auth_service):
        """Test successful token verification."""
        # Generate a token
        auth_service._generate_token = Mock(return_value="valid.jwt.token")
        token = auth_service._generate_token("user-123")
        
        # Mock the JWT decode
        with pytest.mock.patch('jwt.decode') as mock_decode:
            mock_decode.return_value = {"userId": "user-123"}
            
            user_id = auth_service.verify_token(token)
            
            assert user_id == "user-123"
    
    def test_verify_token_expired(self, auth_service):
        """Test verification of expired token."""
        with pytest.mock.patch('jwt.decode') as mock_decode:
            mock_decode.side_effect = pyjwt.ExpiredSignatureError()
            
            with pytest.raises(AuthenticationError) as exc_info:
                auth_service.verify_token("expired.token")
            
            assert "expired" in str(exc_info.value).lower()
    
    def test_verify_token_invalid(self, auth_service):
        """Test verification of invalid token."""
        with pytest.mock.patch('jwt.decode') as mock_decode:
            mock_decode.side_effect = pyjwt.InvalidTokenError()
            
            with pytest.raises(AuthenticationError) as exc_info:
                auth_service.verify_token("invalid.token")
            
            assert "invalid" in str(exc_info.value).lower()
    
    def test_get_user_by_id_success(self, auth_service, mock_user_repository, sample_user):
        """Test getting user by ID."""
        mock_user_repository.find_by_id.return_value = sample_user
        
        user = auth_service.get_user_by_id("user-123")
        
        assert user is not None
        assert user.id == "user-123"
        mock_user_repository.find_by_id.assert_called_once_with("user-123")
    
    def test_get_user_by_id_not_found(self, auth_service, mock_user_repository):
        """Test getting non-existent user."""
        mock_user_repository.find_by_id.return_value = None
        
        with pytest.raises(ResourceNotFoundError):
            auth_service.get_user_by_id("nonexistent")
    
    def test_change_password_success(self, auth_service, mock_user_repository, sample_user):
        """Test successful password change."""
        mock_user_repository.find_by_id.return_value = sample_user
        mock_user_repository.update.return_value = sample_user
        
        auth_service._verify_password = Mock(return_value=True)
        auth_service._hash_password = Mock(return_value="new_hashed_password")
        
        result = auth_service.change_password(
            user_id="user-123",
            old_password="password123",
            new_password="NewPassword456!"
        )
        
        assert result is True
        mock_user_repository.update.assert_called_once()
    
    def test_change_password_wrong_old_password(self, auth_service, mock_user_repository, sample_user):
        """Test password change with wrong old password."""
        mock_user_repository.find_by_id.return_value = sample_user
        auth_service._verify_password = Mock(return_value=False)
        
        with pytest.raises(AuthenticationError) as exc_info:
            auth_service.change_password(
                user_id="user-123",
                old_password="wrongpassword",
                new_password="NewPassword456!"
            )
        
        assert "incorrect" in str(exc_info.value).lower()
    
    def test_hash_password(self, auth_service):
        """Test password hashing."""
        password = "TestPassword123!"
        hashed = auth_service._hash_password(password)
        
        assert hashed is not None
        assert hashed != password
        assert isinstance(hashed, str)
    
    def test_verify_password(self, auth_service):
        """Test password verification."""
        password = "TestPassword123!"
        hashed = auth_service._hash_password(password)
        
        # Verify correct password
        assert auth_service._verify_password(password, hashed) is True
        
        # Verify wrong password
        assert auth_service._verify_password("WrongPassword", hashed) is False
