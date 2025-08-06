from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class Reminder(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sender_id: str  # admin/faculty user id
    recipient_ids: Optional[List[str]] = None  # list of student user ids, or None for all
    drive_id: Optional[str] = None
    job_id: Optional[str] = None
    read_by: Optional[List[str]] = []