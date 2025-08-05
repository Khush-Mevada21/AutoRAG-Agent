from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from datetime import datetime

class EmailEntry(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
