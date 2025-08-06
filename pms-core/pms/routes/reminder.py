from fastapi import APIRouter, HTTPException, Body
from pms.models.reminder import Reminder
from pms.services.reminder_services import reminder_mgr

router = APIRouter()

@router.post("/", response_model=str)
async def create_reminder(reminder: Reminder):
    try:
        return await reminder_mgr.create_reminder(reminder)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/student/{student_id}")
async def get_reminders_for_student(student_id: str):
    try:
        return await reminder_mgr.get_reminders_for_student(student_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{reminder_id}/read/{student_id}")
async def mark_reminder_read(reminder_id: str, student_id: str):
    try:
        await reminder_mgr.mark_reminder_read(reminder_id, student_id)
        return {"msg": "Marked as read"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))