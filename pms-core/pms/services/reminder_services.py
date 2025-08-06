from pms.models.reminder import Reminder
from pms.db.database import DatabaseConnection
from bson import ObjectId

class ReminderMgr:
    def __init__(self):
        self.db = None
        self.reminders_collection = None

    async def initialize(self):
        self.db = DatabaseConnection()
        self.reminders_collection = await self.db.get_collection("reminders")

    async def create_reminder(self, reminder: Reminder):
        data = reminder.model_dump(exclude_unset=True)
        result = await self.reminders_collection.insert_one(data)
        return str(result.inserted_id)

    async def get_reminders_for_student(self, student_id: str):
        reminders = await self.reminders_collection.find({
            "$or": [
                {"recipient_ids": student_id},
                {"recipient_ids": None}  # for all
            ]
        }).sort("created_at", -1).to_list(length=100)
        for r in reminders:
            r["_id"] = str(r["_id"])
        return reminders

    async def mark_reminder_read(self, reminder_id: str, student_id: str):
        await self.reminders_collection.update_one(
            {"_id": ObjectId(reminder_id)},
            {"$addToSet": {"read_by": student_id}}
        )

reminder_mgr = ReminderMgr()