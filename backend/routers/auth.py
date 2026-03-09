import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import create_user, get_user_by_email, get_user_by_id
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()


class SignupRequest(BaseModel):
    email: str
    password: str
    name: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/api/auth/signup")
async def signup(request: SignupRequest):
    try:
        existing_user = get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        password_hash = get_password_hash(request.password)
        user_id = str(uuid.uuid4())
        create_user(user_id, request.email, password_hash, request.name)
        token = create_access_token({"userId": user_id})

        return {
            "success": True,
            "token": token,
            "user": {"id": user_id, "email": request.email, "name": request.name}
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create account")


@router.post("/api/auth/login")
async def login(request: LoginRequest):
    try:
        user = get_user_by_email(request.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not verify_password(request.password, user['password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"userId": user['id']})

        return {
            "success": True,
            "token": token,
            "user": {"id": user['id'], "email": user['email'], "name": user['name']}
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Failed to login")


@router.get("/api/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    try:
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"id": user['id'], "email": user['email'], "name": user['name']}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user")
