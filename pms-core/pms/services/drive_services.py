from datetime import datetime, timedelta
import logging

from fastapi import HTTPException
from pms.models.drive import Drive, DriveUpdate
from pymongo import ReturnDocument
from typing import List
from bson import ObjectId
from pms.db.database import DatabaseConnection
from pms.core.config import config
from pms.services.notice_services import notice_mgr
from pms.models.notice import Notice


class DriveMgr:
    def __init__(self):
        self.db = None
        self.drive_collection = None
    
    async def initialize(self):
        self.db = DatabaseConnection()
        self.drive_collection = await self.db.get_collection("drives")
        
    async def get_drives(self):
        try:
            drives = await self.drive_collection.find().to_list(length=100)
            if len(drives) == 0:
                print("No drives added")
            for drive in drives:
                drive["_id"] = str(drive["_id"])
            return drives
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    async def get_drive(self, drive_id: str):
        try:
            drive = await self.drive_collection.find_one({"_id": ObjectId(drive_id)})
            if drive:
                drive["_id"] = str(drive["_id"])
                
                # Ensure levels is an empty list if not present
                if "levels" not in drive or drive["levels"] is None:
                    drive["levels"] = []
                
                return drive
            else:
                raise Exception("Drive not found")
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    async def add_drive(self, drive: Drive):
        try:
            drive_data = drive.model_dump()
            response = await self.drive_collection.insert_one(drive_data)
            inserted_drive = await self.drive_collection.find_one({"_id": response.inserted_id})
            
            # Ensure the ID is properly stringified
            drive_id = str(inserted_drive["_id"])
            inserted_drive["_id"] = drive_id
            
            print(f"Debug - Inserted drive: {inserted_drive}")  # Debug log
            
            return {
                "status": "success",
                "message": "Drive added successfully",
                "data": {
                    "_id": drive_id,  # Ensure ID is included in a consistent location
                    **inserted_drive
                }
            }
        except Exception as e:
            print(f"Debug - Error in add_drive: {str(e)}")
            raise Exception(f"Error adding drive: {str(e)}")
    
    async def update_drive(self, drive_id: str, drive: DriveUpdate):
        try:
            drive_data = drive.model_dump(exclude_none=True)
            
            # Ensure stages is a list of strings
            if "stages" in drive_data:
                drive_data["stages"] = [str(stage) for stage in drive_data["stages"]]

            response = await self.drive_collection.find_one_and_update(
                {"_id": ObjectId(drive_id)},
                {"$set": drive_data},
                return_document=ReturnDocument.AFTER,
                projection=None
            )
            if not response:
                raise Exception("Drive not found")
            
            response["_id"] = str(response["_id"])  # Convert ObjectId to string
            
            return {
                "status": "success",
                "message": "Drive updated successfully",
                "data": response
            }
        except Exception as e:
            raise Exception(f"Error updating drive: {str(e)}")
    
    async def delete_drive(self, drive_id: str):
        try:
            response = await self.drive_collection.delete_one({"_id": ObjectId(drive_id)})
            if response.deleted_count == 0:
                raise Exception("Drive not found")
            return {
                "status": "success",
                "message": "Drive deleted successfully"
            }
        except Exception as e:
            raise Exception(f"Error deleting drive: {str(e)}")
    
    async def apply_to_drive(self, drive_id: str, student_id: str):
        try:
            response = await self.drive_collection.find_one_and_update(
                {"_id": ObjectId(drive_id)},
                {"$addToSet": {"applied_students": student_id}},  # Use addToSet to avoid duplicates
                return_document=ReturnDocument.AFTER
            )
            if not response:
                raise Exception("Drive not found")
            
            response["_id"] = str(response["_id"])
            return {
                "status": "success",
                "message": "Successfully applied to drive",
                "data": response
            }
        except Exception as e:
            raise Exception(f"Error applying to drive: {str(e)}")
        
    async def publish_drive(self, drive_id: str):
        try:
            response = await self.drive_collection.find_one_and_update(
                {"_id" : ObjectId(drive_id)},
                {"$set": {"published": True}},  # Use $set for clarity
                return_document= ReturnDocument.AFTER
            )
            if not response:
                raise ValueError("Drive not found")
        
            response["_id"] = str(response["_id"]) 
            return response  # Return the updated document
        except ValueError as ve:
            logging.error(f"ValueError: {str(ve)}")
            raise
        except Exception as e:
            logging.error(f"Error publishing the drive: {str(e)}")
            raise Exception(f"Error publishing the drive: {str(e)}")

    async def set_eligible_students_for_drive(self,drive_id: str):
        try:
            from pms.services.job_services import job_mgr
            drive_jobs = await job_mgr.get_job_by_drive(drive_id)
            drive_eligible_students = []
            for drive_job in drive_jobs:
                for drive_job in drive_jobs:
                    job_eligible_students=drive_job["eligible_students"]
                    for job_eligible_student in job_eligible_students:
                        if job_eligible_student not in drive_eligible_students:
                            drive_eligible_students.append(job_eligible_student)
            response = await self.drive_collection.find_one_and_update(
                {"_id" : ObjectId(drive_id)},
                {"$set": {"eligible_students": drive_eligible_students}},  # Use $set for clarity
                return_document= ReturnDocument.AFTER
            )
            if not response:
                raise ValueError("Drive not found")
            response["_id"] = str(response["_id"]) 
            return response  # Return the updated document
        except ValueError as ve:
            logging.error(f"ValueError: {str(ve)}")
            raise
        except Exception as e:
            # Log the error for debugging
            print(f"Error in setting eligible students for drive {drive_id}: {str(e)}")
            # Re-raise the exception to be caught by the route handler
            raise Exception(f"Failed to set eligible students: {str(e)}")

    async def update_drive_stages(self, drive_id: str):
        """
        Aggregates stage_students from all jobs under this drive.
        """
        try:
            # Get all jobs for this drive
            from pms.services.job_services import job_mgr
            jobs = await job_mgr.get_job_by_drive(drive_id)
            if not jobs:
                return
            
            # Initialize aggregated stages
            aggregated_stages: List[List[str]] = []
            
            # Find maximum number of stages across all jobs
            max_stages = max(len(job.get("stage_students", [])) for job in jobs)
            
            # Initialize aggregated stages with empty lists
            aggregated_stages = [[] for _ in range(max_stages)]
            
            # Aggregate students for each stage
            for job in jobs:
                job_stages = job.get("stage_students", [])
                for stage_index, stage_students in enumerate(job_stages):
                    # Add students to aggregated stage, avoiding duplicates
                    aggregated_stages[stage_index].extend(
                        student for student in stage_students 
                        if student not in aggregated_stages[stage_index]
                    )
            
            # Update drive with aggregated stages
            await self.drive_collection.find_one_and_update(
                {"_id": ObjectId(drive_id)},
                {"$set": {"stage_students": aggregated_stages}},
                return_document=ReturnDocument.AFTER
            )
            
            return aggregated_stages
            
        except Exception as e:
            logging.error(f"Error updating drive stages for drive {drive_id}: {str(e)}")
            raise Exception(f"Failed to update drive stages: {str(e)}")

    async def update_drive_selected_students(self, drive_id: str):
        """
        Aggregates selected students from all jobs under this drive into a single flat list.
        Updates the drive document with the combined list of selected students.
        
        Args:
            drive_id (str): The ID of the drive to update
        """
        try:
            # Get all jobs for this drive
            from pms.services.job_services import job_mgr
            jobs = await job_mgr.get_job_by_drive(drive_id)
            if not jobs:
                return
            
            # Get all selected students from all jobs and flatten into a single list
            drive_selected_students = []
            for job in jobs:
                job_selected_students = job.get("selected_students", [])
                for student in job_selected_students:
                    if student not in drive_selected_students:
                        drive_selected_students.append(student)
            
            # Update drive document with combined selected students
            response = await self.drive_collection.find_one_and_update(
                {"_id": ObjectId(drive_id)},
                {"$set": {"selected_students": drive_selected_students}},
                return_document=ReturnDocument.AFTER
            )
            
            if not response:
                raise HTTPException(
                    status_code=404,
                    detail=f"Drive with ID {drive_id} not found"
                )
                
            return {
                "status": "success",
                "message": "Drive selected students updated successfully",
                "data": {
                    "drive_id": drive_id,
                    "selected_students": drive_selected_students,
                    "total_selected": len(drive_selected_students)
                }
            }
            
        except Exception as e:
            logging.error(f"Error updating selected students for drive {drive_id}: {str(e)}")
            raise Exception(f"Failed to update drive selected students: {str(e)}")

    async def get_drive_summary(self, drive_id: str):
        # Fetch drive
        drive = await self.get_drive(drive_id)
        if not drive:
            raise Exception("Drive not found")

        # Fetch all jobs under this drive
        jobs = await self.jobs_collection.find({"drive_id": drive_id}).to_list(length=100)
        job_ids = [str(job["_id"]) for job in jobs]

        # Fetch all applications for these jobs
        applications = await self.applications_collection.find({"job_id": {"$in": job_ids}}).to_list(length=1000)

        # Group students by stage
        stages = {}
        for app in applications:
            stage = app.get("current_status", "Applied")
            student_info = {
                "student_id": app.get("student_id"),
                "first_name": app.get("first_name"),
                "last_name": app.get("last_name"),
                "email": app.get("email"),
                "job_id": app.get("job_id"),
                "job_title": app.get("job_title", ""),
            }
            stages.setdefault(stage, []).append(student_info)

        return {
            "drive_id": drive_id,
            "drive_title": drive.get("title"),
            "stages": stages
        }

drive_mgr = DriveMgr()

