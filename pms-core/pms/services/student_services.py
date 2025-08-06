from typing import List
from pms.db.database import DatabaseConnection
from pms.models.student import Student, StudentUpdate
from datetime import datetime
from pymongo import ReturnDocument
from bson import ObjectId
from pms.services.user_services import user_mgr
from pms.models.user import User, UserUpdate
from pms.utils.utilities import UtilMgr
from pms.models.alumni import Alumni
from pms.services.alumni_services import alumni_mgr

class StudentMgr:
    def __init__(self):
        self.db = None
        self.students_collection = None
        
    async def initialize(self):
        self.db = DatabaseConnection()
        self.students_collection = await self.db.get_collection("students")

    async def get_students(self):
        try:
            students = await self.students_collection.find().to_list(length=100)
            for student in students:
                student["_id"] = str(student["_id"])
            return students
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
        
    async def add_student(self, student: Student):
        try:
            # First check if student with this email already exists
            existing_student = await self.students_collection.find_one({"email": student.email})
            if existing_student:
                raise Exception("A student with this email already exists")

            # First create the user
            if student.gender not in ["Male","Female","Other"]:
                student.gender = None

            # Create user data dict with only required fields
            user_data = {
                "first_name": student.first_name,
                "email": student.email,
                "role": "student",
                "status": "Inactive"
            }

            # Add optional fields only if they have values
            if student.middle_name is not None:
                user_data["middle_name"] = student.middle_name
            if student.last_name is not None:
                user_data["last_name"] = student.last_name
            if student.ph_no is not None and student.ph_no.strip():  
                user_data["ph_no"] = student.ph_no
            if student.gender is not None:
                user_data["gender"] = student.gender

            # Create User object with filtered data
            user = User(**user_data)
            
            try:
                # Add user first
                user_response = await user_mgr.add_user(user)
                user_id = user_response["id"]

                return {
                    "status": "success",
                    "message": "User created successfully",
                    "user_id": user_id
                }
                
            except Exception as inner_e:
                # If student creation fails, rollback user creation
                if 'user_id' in locals():
                    await user_mgr.delete_user(user_id)
                raise inner_e

        except Exception as e:
            raise Exception(f"Error adding student: {str(e)}")
    
    async def get_student(self, student_id: str):
        try:
            student = await self.students_collection.find_one({"_id": ObjectId(student_id)})
            if student:
                student["_id"] = str(student["_id"])
                return student
            raise Exception("Student not found")
        except Exception as e:
            raise Exception(f"Error fetching student: {str(e)}")
    
    async def get_student_by_user_id(self, user_id: str):
        try:
            student = await self.students_collection.find_one({"user_id": user_id})
            if student:
                student["_id"] = str(student["_id"])
                return student
            raise Exception("Student not found")
        except Exception as e:
            raise Exception(f"Error fetching student: {str(e)}")
    
    async def update_student(self, student_id: str, student: StudentUpdate):
        try:
            existing_student = await self.students_collection.find_one({"_id": ObjectId(student_id)})
            if not existing_student:
                raise Exception("Student not found")

            # Update user first
            user_data = UserUpdate(
                first_name=student.first_name,
                middle_name=student.middle_name,
                last_name=student.last_name,
                email=student.email,
                ph_no=student.ph_no,
                gender=student.gender
            )
            await user_mgr.update_user(existing_student["user_id"], user_data)

            # Update student
            updated_data = student.model_dump(exclude_unset=True)
            updated_data["updated_at"] = datetime.now()
            
            updated_student = await self.students_collection.find_one_and_update(
                {"_id": ObjectId(student_id)},
                {"$set": updated_data},
                return_document=ReturnDocument.AFTER
            )
            
            if not updated_student:
                raise Exception("Failed to update student")
            
            updated_student["_id"] = str(updated_student["_id"])
            return updated_student
        except Exception as e:
            if isinstance(e, Exception) and hasattr(e, 'args') and e.args and isinstance(e.args[0], dict) and 'status' in e.args[0]:
                raise
            # Otherwise create a new error
            print("Not already our formatted error, creating a new one")
            error = UtilMgr._create_error_response(
                UtilMgr,code="UPDATE_STUDENT_ERROR",
                detail=f"Error updating student: {str(e)}"
            )
            raise Exception(error)
        
    async def delete_student(self, student_id: str):
        try:
            # Get student first
            student = await self.students_collection.find_one({"_id": ObjectId(student_id)})
            if not student:
                raise Exception("Student not found")

            # Delete student record first
            result = await self.students_collection.delete_one({"_id": ObjectId(student_id)})
            if result.deleted_count == 0:
                raise Exception("Failed to delete student")

            # Then delete user
            await user_mgr.delete_user(student["user_id"])
            
            return {"status": "success", "message": "Student and associated user deleted"}
        except Exception as e:
            raise Exception(f"Error deleting student: {str(e)}")

    async def update_by_user_id(self, user_id: str, data: dict):
        try:
            data["updated_at"] = datetime.now()
            student = await self.students_collection.find_one_and_update(
                {"user_id": user_id},
                {"$set": data},
                return_document=ReturnDocument.AFTER
            )
            if student:
                student["_id"] = str(student["_id"])
                return student
            return None
        except Exception as e:
            raise Exception(f"Error updating student: {str(e)}")
    
    async def get_students_by_ids(self, student_ids: List[str]):
        """
        Fetches multiple student documents based on a list of student IDs.
        """
        try:
            object_ids = []
            invalid_ids = []
            for s_id in student_ids:
                if ObjectId.is_valid(s_id):
                    object_ids.append(ObjectId(s_id))
                else:
                    invalid_ids.append(s_id)

            if invalid_ids:
                raise ValueError(f"Invalid ObjectId format for IDs: {', '.join(invalid_ids)}")

            if not object_ids:
                return [] 

            students_list = await self.students_collection.find({"_id": {"$in": object_ids}}).to_list(length=None)
            for student in students_list:
                student["_id"] = str(student["_id"])
            return students_list
        
        except ValueError as ve: 
            raise Exception(str(ve))
        except Exception as e:
            print(f"Database error fetching students by ID: {e}")
            raise Exception(f"Error fetching students by IDs: {str(e)}")
    async def get_drives_for_student(self, student_id: str):
        try:
            from pms.services.drive_services import drive_mgr
            drives = await drive_mgr.drive_collection.find(
                {
                    "eligible_students": {"$in": [student_id]},
                    "published": True
                }
            ).to_list(length=None)
            for drive in drives:
                drive["_id"] = str(drive["_id"])
            return drives
        except Exception as e:
            raise Exception(f"Error fetching drives for student: {str(e)}")

    async def sync_from_user(self, user_data: dict, user_id: str):
        """Synchronize student data when user is updated"""
        try:
            # Check if student record exists
            existing = await self.students_collection.find_one({"user_id": user_id})
            
            sync_data = {
                "first_name": user_data.get("first_name"),
                "middle_name": user_data.get("middle_name"),
                "last_name": user_data.get("last_name"),
                "email": user_data.get("email"),
                "ph_no": user_data.get("ph_no"),
                "gender": user_data.get("gender"),
                "updated_at": datetime.now()
            }

            if existing:
                # Update existing record
                await self.students_collection.update_one(
                    {"user_id": user_id},
                    {"$set": sync_data}
                )
            else:
                # Create new record
                sync_data["user_id"] = user_id
                sync_data["created_at"] = datetime.now()
                await self.students_collection.insert_one(sync_data)

        except Exception as e:
            raise Exception(f"Error syncing student data: {str(e)}")

    async def delete_by_user_id(self, user_id: str):
        """Delete student record by user_id"""
        try:
            result = await self.students_collection.delete_one({"user_id": user_id})
            return result.deleted_count > 0
        except Exception as e:
            raise Exception(f"Error deleting student record: {str(e)}")

    async def migrate_student_to_alumni(self, student_id: str):
        # Fetch student
        student = await self.get_student(student_id)
        if not student:
            raise Exception("Student not found")

        user_id = student.get("user_id")
        if not user_id:
            raise Exception("Student does not have a linked user_id")

        # Update user role to alumni (direct, no sync)
        await user_mgr.update_user_fields_direct(
            user_id,
            {
                "role": "alumni",
                "status": "Active",
                "can_post": True,
                "can_comment": True
            }
        )

        # Prepare alumni data
        alumni_data = {
            "user_id": user_id,
            "first_name": student.get("first_name"),
            "middle_name": student.get("middle_name"),
            "last_name": student.get("last_name"),
            "email": student.get("email"),
            "ph_no": student.get("ph_no"),
            "branch": student.get("branch"),
            "batch": student.get("batch"),
            "current_job": student.get("current_job", None),
            # Add more fields as needed
        }
        # Create alumni record (do not create user again)
        await alumni_mgr.add_alumni_existing_user(Alumni(**alumni_data))

        # Optionally, mark student as alumni
        # await self.update_student(student_id, {"status": "alumni"})

        return {"msg": "Student migrated to alumni"}

student_mgr = StudentMgr()
