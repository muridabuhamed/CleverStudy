"""Admin routes using clean architecture."""
from typing import Dict, Any, List
from fastapi import APIRouter, Header, status

from core.config import get_settings
from core.exceptions import AuthorizationError
from api.dependencies import UserRepo, handle_service_exception

router = APIRouter()

settings = get_settings()


@router.get("/api/admin/users")
async def admin_get_users(
    user_repo: UserRepo,
    secret: str = ""
) -> Dict[str, Any]:
    """
    Get all users (admin only).
    
    Requires ADMIN_SECRET environment variable to be set and matched.
    """
    try:
        # Verify admin secret
        if not settings.admin_secret or secret != settings.admin_secret:
            raise AuthorizationError("Invalid admin credentials")
        
        # Get all users
        users = user_repo.find_all()
        
        return {
            "total": len(users),
            "users": [
                {
                    "id": u.id,
                    "email": u.email,
                    "name": u.name,
                    "created_at": u.created_at.isoformat()
                }
                for u in users
            ]
        }
    except Exception as e:
        raise handle_service_exception(e)
