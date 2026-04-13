"""
Authentication service.

This module handles user authentication, registration, and JWT token management.
"""
import bcrypt
import jwt as pyjwt
from datetime import datetime, timedelta
from typing import Optional, Tuple
import uuid

from repository.user_repository import UserRepository
from domain.user import UserModel, UserCreate, UserLogin
from core.config import get_settings
from core.exceptions import (
    AuthenticationError,
    ValidationError,
    ResourceNotFoundError
)
from core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()


class AuthService:
    """
    Service for authentication operations.
    
    Handles user registration, login, password verification, and JWT tokens.
    """
    
    def __init__(self, user_repository: UserRepository):
        """
        Initialize auth service.
        
        Args:
            user_repository: User data access layer
        """
        self.user_repo = user_repository
    
    def register_user(self, user_data: UserCreate) -> Tuple[UserModel, str]:
        """
        Register a new user.
        
        Args:
            user_data: User registration data
            
        Returns:
            Tuple of (created user, JWT token)
            
        Raises:
            ValidationError: If email already exists
        """
        normalized_email = user_data.email.strip().lower()

        # Check if email already exists
        if self.user_repo.email_exists(normalized_email):
            raise ValidationError(f"Email {normalized_email} is already registered")
        
        # Hash password
        password_hash = self._hash_password(user_data.password)
        
        # Create user model
        user_id = str(uuid.uuid4())
        user = UserModel(
            id=user_id,
            email=normalized_email,
            password_hash=password_hash,
            name=user_data.name,
            created_at=datetime.now()
        )
        
        # Save to database
        created_user = self.user_repo.create(user)
        
        # Generate JWT token
        token = self._generate_token(user_id)
        
        logger.info(f"User registered: {normalized_email} (ID: {user_id})")
        
        return created_user, token
    
    def login_user(self, login_data: UserLogin) -> Tuple[UserModel, str]:
        """
        Authenticate user and generate token.
        
        Args:
            login_data: Login credentials
            
        Returns:
            Tuple of (user, JWT token)
            
        Raises:
            AuthenticationError: If credentials are invalid
        """
        normalized_email = login_data.email.strip().lower()

        # Find user by email
        user = self.user_repo.find_by_email(normalized_email)
        if not user:
            raise AuthenticationError("Invalid email or password")
        
        # Verify password
        if not self._verify_password(login_data.password, user.password_hash):
            raise AuthenticationError("Invalid email or password")
        
        # Generate JWT token
        token = self._generate_token(user.id)
        
        logger.info(f"User logged in: {normalized_email}")
        
        return user, token
    
    def verify_token(self, token: str) -> str:
        """
        Verify JWT token and extract user ID.
        
        Args:
            token: JWT token string
            
        Returns:
            User ID from token
            
        Raises:
            AuthenticationError: If token is invalid or expired
        """
        try:
            payload = pyjwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            user_id = payload.get("userId")
            if not user_id:
                raise AuthenticationError("Invalid token payload")
            
            return user_id
            
        except pyjwt.ExpiredSignatureError:
            raise AuthenticationError("Token has expired")
        except pyjwt.InvalidTokenError as e:
            raise AuthenticationError(f"Invalid token: {str(e)}")
    
    def get_user_by_id(self, user_id: str) -> UserModel:
        """
        Get user by ID.
        
        Args:
            user_id: User identifier
            
        Returns:
            User model
            
        Raises:
            ResourceNotFoundError: If user doesn't exist
        """
        user = self.user_repo.find_by_id(user_id)
        if not user:
            raise ResourceNotFoundError("User", user_id)
        
        return user
    
    def change_password(
        self,
        user_id: str,
        old_password: str,
        new_password: str
    ) -> bool:
        """
        Change user password.
        
        Args:
            user_id: User identifier
            old_password: Current password
            new_password: New password
            
        Returns:
            True if password was changed
            
        Raises:
            AuthenticationError: If old password is incorrect
            ResourceNotFoundError: If user doesn't exist
        """
        # Get user
        user = self.get_user_by_id(user_id)
        
        # Verify old password
        if not self._verify_password(old_password, user.password_hash):
            raise AuthenticationError("Current password is incorrect")
        
        # Validate new password (uses Pydantic validator)
        UserCreate(
            email=user.email,
            password=new_password,
            name=user.name
        )
        
        # Hash new password
        new_hash = self._hash_password(new_password)
        
        # Update user
        user.password_hash = new_hash
        self.user_repo.update(user)
        
        logger.info(f"Password changed for user: {user_id}")
        
        return True
    
    def _hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password
        """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def _verify_password(self, password: str, password_hash: str) -> bool:
        """
        Verify a password against a hash.
        
        Args:
            password: Plain text password
            password_hash: Stored password hash
            
        Returns:
            True if password matches
        """
        try:
            return bcrypt.checkpw(
                password.encode('utf-8'),
                password_hash.encode('utf-8')
            )
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            return False
    
    def _generate_token(self, user_id: str) -> str:
        """
        Generate JWT token for a user.
        
        Args:
            user_id: User identifier
            
        Returns:
            JWT token string
        """
        payload = {
            "userId": user_id,
            "exp": datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS),
            "iat": datetime.utcnow()
        }
        
        token = pyjwt.encode(
            payload,
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )
        
        return token
