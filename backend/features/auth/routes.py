"""Authentication routes using clean architecture."""
from typing import Dict, Any
from fastapi import APIRouter, status

from domain.user import UserCreate, UserLogin, UserResponse
from api.dependencies import AuthServ, CurrentUser, UserRepo, handle_service_exception

router = APIRouter()


@router.post("/api/auth/signup", status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    auth_service: AuthServ
) -> Dict[str, Any]:
    """
    Register a new user account.
    
    - Validates email format and password strength
    - Checks for duplicate email addresses
    - Securely hashes password
    - Returns JWT token for authentication
    """
    try:
        user, token = auth_service.register_user(user_data)
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.post("/api/auth/login")
async def login(
    login_data: UserLogin,
    auth_service: AuthServ
) -> Dict[str, Any]:
    """
    Authenticate user with email and password.
    
    - Validates credentials
    - Returns JWT token on success
    - Returns 401 for invalid credentials
    """
    try:
        user, token = auth_service.login_user(login_data)
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        }
    except Exception as e:
        raise handle_service_exception(e)


@router.get("/api/auth/me")
async def get_me(
    user_id: CurrentUser,
    user_repo: UserRepo
) -> Dict[str, Any]:
    """
    Get current authenticated user's profile.
    
    Requires valid JWT token in Authorization header.
    """
    try:
        user = user_repo.find_by_id(user_id)
        if not user:
            from core.exceptions import ResourceNotFoundError
            raise ResourceNotFoundError("User", user_id)
        
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    except Exception as e:
        raise handle_service_exception(e)
