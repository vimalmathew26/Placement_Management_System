from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Notice(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    author: Optional[str] = None
    drive_id: Optional[str] = None
    job_id: Optional[str] = None