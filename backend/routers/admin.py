import os
from fastapi import APIRouter, HTTPException
from database import get_all_users

router = APIRouter()


@router.get("/api/admin/users")
async def admin_get_users(secret: str = ""):
    admin_secret = os.getenv("ADMIN_SECRET", "")
    if not admin_secret or secret != admin_secret:
        raise HTTPException(status_code=403, detail="Forbidden")
    users = get_all_users()
    return {"total": len(users), "users": users}
