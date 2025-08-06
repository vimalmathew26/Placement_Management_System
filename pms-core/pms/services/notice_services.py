from typing import List, Optional
from pms.db.database import DatabaseConnection
from pms.models.notice import Notice
from datetime import datetime
from bson import ObjectId

class NoticeManager:
    def __init__(self):
        self.db = None
        self.notices_collection = None

    async def initialize(self):
        self.db = DatabaseConnection()
        self.notices_collection = await self.db.get_collection("notices")

    async def create_notice(self, notice: Notice) -> str:
        try:
            notice_data = notice.model_dump(exclude_unset=True)
            notice_data["created_at"] = datetime.utcnow()
            result = await self.notices_collection.insert_one(notice_data)
            return str(result.inserted_id)
        except Exception as e:
            raise Exception(f"Error creating notice: {str(e)}")

    async def get_all_notices(self) -> List[dict]:
        try:
            notices = await self.notices_collection.find().sort("created_at", -1).to_list(length=100)
            for notice in notices:
                notice["_id"] = str(notice["_id"])
            return notices
        except Exception as e:
            raise Exception(f"Error fetching notices: {str(e)}")

    async def update_notice(self, notice_id: str, update_data: dict):
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await self.notices_collection.update_one(
                {"_id": ObjectId(notice_id)},
                {"$set": update_data}
            )
            if result.modified_count == 0:
                raise Exception("Notice not found or not updated")
        except Exception as e:
            raise Exception(f"Error updating notice: {str(e)}")

    async def delete_notice(self, notice_id: str):
        try:
            result = await self.notices_collection.delete_one({"_id": ObjectId(notice_id)})
            if result.deleted_count == 0:
                raise Exception("Notice not found or not deleted")
        except Exception as e:
            raise Exception(f"Error deleting notice: {str(e)}")

notice_mgr = NoticeManager()