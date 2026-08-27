from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), unique=True, index=True, nullable=False)
    data = Column(Text, nullable=False)  # JSON serialized weather data
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(Text, nullable=True)  # Optional JSON details (weather/risk cards, sources)

    session = relationship("ChatSession", back_populates="messages")

class OfficialAlert(Base):
    __tablename__ = "official_alerts"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), index=True, nullable=False)
    severity = Column(String(20), nullable=False)  # 'SEVERE', 'WARNING', 'WATCH', 'INFORMATION'
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    expected_period = Column(String(100), nullable=True)
    impacts = Column(Text, nullable=True)  # JSON list
    actions = Column(Text, nullable=True)  # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)
