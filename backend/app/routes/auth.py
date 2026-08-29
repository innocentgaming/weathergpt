from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import hashlib
import secrets
from datetime import datetime

from app.database import get_db
from app.models.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(password: str) -> str:
    # Use sha256 with a fixed salt for deterministic and portable hashing
    salt = "weathergpt_secure_salt_2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: Optional[str] = "general"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class GuestLoginRequest(BaseModel):
    role: Optional[str] = "general"
    name: Optional[str] = "Guest Explorer"

class UserOut(BaseModel):
    id: Optional[int] = None
    email: str
    name: str
    role: str
    is_guest: bool = False
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: UserOut
    token: str

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    if not req.email or not req.password or not req.name:
        raise HTTPException(status_code=400, detail="Name, email, and password are required.")
    
    clean_email = req.email.strip().lower()
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    valid_roles = ["general", "traveller", "farmer", "disaster", "school"]
    user_role = req.role if req.role in valid_roles else "general"

    new_user = User(
        email=clean_email,
        hashed_password=hash_password(req.password),
        name=req.name.strip(),
        role=user_role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = f"wgpt_{new_user.id}_{secrets.token_hex(16)}"

    return AuthResponse(
        success=True,
        message="Account created successfully!",
        user=UserOut(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name,
            role=new_user.role,
            is_guest=False,
            created_at=new_user.created_at.isoformat() if new_user.created_at else None
        ),
        token=token
    )

@router.post("/login", response_model=AuthResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = f"wgpt_{user.id}_{secrets.token_hex(16)}"

    return AuthResponse(
        success=True,
        message="Signed in successfully!",
        user=UserOut(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            is_guest=False,
            created_at=user.created_at.isoformat() if user.created_at else None
        ),
        token=token
    )

@router.post("/guest", response_model=AuthResponse)
def guest_login(req: GuestLoginRequest = GuestLoginRequest()):
    valid_roles = ["general", "traveller", "farmer", "disaster", "school"]
    role = req.role if req.role in valid_roles else "general"
    token = f"wgpt_guest_{secrets.token_hex(12)}"

    return AuthResponse(
        success=True,
        message="Guest session initialized.",
        user=UserOut(
            id=None,
            email="guest@weathergpt.local",
            name=req.name or "Guest Explorer",
            role=role,
            is_guest=True,
            created_at=datetime.utcnow().isoformat()
        ),
        token=token
    )

@router.get("/me")
def get_current_user_profile(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing or malformed.")
    
    raw_token = authorization.replace("Bearer ", "").strip()
    if raw_token.startswith("wgpt_guest_"):
        return {
            "authenticated": True,
            "user": {
                "email": "guest@weathergpt.local",
                "name": "Guest Explorer",
                "role": "general",
                "is_guest": True
            }
        }
    
    parts = raw_token.split("_")
    if len(parts) >= 2 and parts[1].isdigit():
        user_id = int(parts[1])
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role,
                    "is_guest": False
                }
            }
            
    raise HTTPException(status_code=401, detail="Invalid session token.")
