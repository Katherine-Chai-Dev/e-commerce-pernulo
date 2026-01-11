from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timedelta
import bcrypt
import secrets


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: Optional[str] = None
    google_id: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    auth_provider: str = "local"
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None
    is_admin: bool = Field(default=False)

    def set_password(self, password: str):
        self.password_hash = bcrypt.hashpw(
            password.encode(), bcrypt.gensalt(rounds=12)
        ).decode()

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode(), self.password_hash.encode())

    def generate_reset_token(self):
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token

    def verify_reset_token(self, token: str) -> bool:
        if not self.reset_token or not self.reset_token_expires:
            return False
        if self.reset_token != token:
            return False
        if datetime.utcnow() > self.reset_token_expires:
            return False
        return True

    def clear_reset_token(self):
        self.reset_token = None
        self.reset_token_expires = None


class UserCreate(SQLModel):
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=100)
    name: str = Field(min_length=1, max_length=100)


class UserLogin(SQLModel):
    email: str
    password: str


class GoogleUserData(SQLModel):
    sub: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None


class UserResponse(SQLModel):
    id: int
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    auth_provider: str
    is_admin: bool = False
    created_at: Optional[datetime] = None


class ForgotPasswordRequest(SQLModel):
    email: str


class ResetPasswordRequest(SQLModel):
    token: str
    password: str = Field(min_length=8, max_length=100)
