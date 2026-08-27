from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PORT: int = 8000
    DEMO_MODE: bool = True
    DATABASE_URL: str = "sqlite:///./weathergpt.db"
    GEMINI_API_KEY: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
