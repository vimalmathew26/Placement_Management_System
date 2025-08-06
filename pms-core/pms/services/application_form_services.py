from datetime import datetime
from fastapi import HTTPException
from pymongo import ReturnDocument
from typing import List, Optional, Dict
from bson import ObjectId
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

from pms.models.application_form import ApplicationForm, ApplicationFormUpdate
from pms.db.database import DatabaseConnection

class ApplicationFormMgr:
    def __init__(self):
        self.db = None
        self.application_form_collection = None
        
    async def initialize(self):
        self.db = DatabaseConnection()
        self.application_form_collection = await self.db.get_collection("application_forms")
    
    async def get_applications(self) -> List[ApplicationForm]:
        """Get all application forms"""
        try:
            applications = await self.application_form_collection.find().to_list(length=100)
            for app in applications:
                app["_id"] = str(app["_id"])
            return applications
        except Exception as e:
            raise Exception(f"Error fetching applications: {str(e)}")

    async def get_application(self, application_id: str) -> ApplicationForm:
        """Get specific application by ID"""
        try:
            application = await self.application_form_collection.find_one(
                {"_id": ObjectId(application_id)}
            )
            if not application:
                raise HTTPException(status_code=404, detail="Application not found")
            application["_id"] = str(application["_id"])
            return application
        except Exception as e:
            raise Exception(f"Error fetching application: {str(e)}")

    async def get_applications_by_drive(self, drive_id: str) -> List[ApplicationForm]:
        """Get all applications for a specific drive"""
        try:
            applications = await self.application_form_collection.find(
                {"drive_id": drive_id}
            ).to_list(length=None)
            for app in applications:
                app["_id"] = str(app["_id"])
            return applications
        except Exception as e:
            raise Exception(f"Error fetching applications by drive: {str(e)}")

    async def get_applications_by_job(self, job_id: str) -> List[ApplicationForm]:
        """Get all applications for a specific job"""
        try:
            applications = await self.application_form_collection.find(
                {"job_id": job_id}
            ).to_list(length=None)
            for app in applications:
                app["_id"] = str(app["_id"])
            return applications
        except Exception as e:
            raise Exception(f"Error fetching applications by job: {str(e)}")

    async def get_student_applications(self, student_id: str) -> List[ApplicationForm]:
        """Get all applications submitted by a specific student"""
        try:
            applications = await self.application_form_collection.find(
                {"student_id": student_id}
            ).to_list(length=None)
            for app in applications:
                app["_id"] = str(app["_id"])
            return applications
        except Exception as e:
            raise Exception(f"Error fetching student applications: {str(e)}")

    async def create_application(self, student_id: str, application: ApplicationForm):
        """Create a new application submission"""
        try:
            # Check if student already applied for this job
            existing = await self.application_form_collection.find_one({
                "job_id": application.job_id,
                "student_id": student_id
            })
            if existing:
                raise HTTPException(
                    status_code=400, 
                    detail="Student has already applied for this job"
                )
            print(application)
            
            application_data = application.model_dump()
            application_data["submitted_at"] = datetime.now()
            application_data["updated_at"] = datetime.now()
            
            result = await self.application_form_collection.insert_one(application_data)
            created_app = await self.application_form_collection.find_one(
                {"_id": result.inserted_id}
            )
            created_app["_id"] = str(created_app["_id"])
            
            # Return just the application data instead of the wrapped response
            return created_app
        except Exception as e:
            raise Exception(f"Error creating application: {str(e)}")

    async def delete_application(self, application_id: str) -> Dict:
        """Delete an application submission"""
        try:
            result = await self.application_form_collection.find_one_and_delete(
                {"_id": ObjectId(application_id)}
            )
            
            if not result:
                raise HTTPException(status_code=404, detail="Application not found")
                
            result["_id"] = str(result["_id"])
            return {
                "status": "success",
                "message": "Application deleted successfully",
                "data": result
            }
        except Exception as e:
            raise Exception(f"Error deleting application: {str(e)}")
        
    async def get_student_application_by_drive_and_job(self, student_id: str, drive_id: str, job_id: str) -> Optional[ApplicationForm]:
        """Get application submitted by a specific student for a specific drive and job"""
        try:
            app = await self.application_form_collection.find_one({
                "student_id": student_id,
                "drive_id": drive_id,
                "job_id": job_id
            })
            
            if not app:
                return None  # Return None instead of empty list
                
            app["_id"] = str(app["_id"])
            return app
        except Exception as e:
            raise Exception(f"Error fetching student application by drive and job: {str(e)}")

    async def export_applications_by_job_pdf(self, job_id: str) -> bytes:
        """Export all applications for a specific job as a PDF"""
        try:
            applications = await self.get_applications_by_job(job_id)
            buffer = BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter

            y = height - 40
            p.setFont("Helvetica-Bold", 14)
            p.drawString(40, y, f"Applications for Job ID: {job_id}")
            y -= 30

            p.setFont("Helvetica", 10)
            for app in applications:
                if y < 60:
                    p.showPage()
                    y = height - 40
                name = f"{app.get('first_name', '')} {app.get('last_name', '')}"
                email = app.get('email', '')
                status = app.get('current_status', '')
                p.drawString(40, y, f"Name: {name} | Email: {email} | Status: {status}")
                y -= 18

            p.save()
            buffer.seek(0)
            return buffer.read()
        except Exception as e:
            raise Exception(f"Error exporting applications as PDF: {str(e)}")

    async def get_applications_with_resume_by_job(self, job_id: str) -> list:
        """Fetch all applications for a job, including application form and resume."""
        applications = await self.get_applications_by_job(job_id)
        db = DatabaseConnection()
        resumes_collection = await db.get_collection("resumes")
        results = []
        for app in applications:
            student_id = app.get("student_id")
            resume = await resumes_collection.find_one({"student_id": student_id})
            if resume:
                resume["_id"] = str(resume["_id"])
            results.append({
                "application": app,
                "resume": resume
            })
        return results

    async def export_applications_with_resume_by_job_pdf(self, job_id: str) -> bytes:
        """Export all applications (with resume) for a job as a PDF."""
        data = await self.get_applications_with_resume_by_job(job_id)
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        y = height - 40
        p.setFont("Helvetica-Bold", 14)
        p.drawString(40, y, f"Applications for Job ID: {job_id}")
        y -= 30

        for idx, entry in enumerate(data, 1):
            app = entry["application"]
            resume = entry["resume"]
            if y < 120:
                p.showPage()
                y = height - 40

            # Application Section
            p.setFont("Helvetica-Bold", 12)
            p.drawString(40, y, f"Applicant #{idx}")
            y -= 18
            p.setFont("Helvetica", 10)
            p.drawString(40, y, f"Name: {app.get('first_name', '')} {app.get('last_name', '')}")
            y -= 14
            p.drawString(40, y, f"Email: {app.get('email', '')}")
            y -= 14
            p.drawString(40, y, f"Status: {app.get('current_status', '')}")
            y -= 14
            p.drawString(40, y, f"Applied On: {app.get('applied_on', '')}")
            y -= 18

            # Application Form Details (add more fields as needed)
            p.setFont("Helvetica-Bold", 11)
            p.drawString(40, y, "Application Form:")
            y -= 14
            p.setFont("Helvetica", 10)
            for key, value in app.items():
                if key in ["_id", "student_id", "job_id", "drive_id", "first_name", "last_name", "email", "current_status", "applied_on"]:
                    continue
                p.drawString(60, y, f"{key}: {value}")
                y -= 12
                if y < 60:
                    p.showPage()
                    y = height - 40

            # Resume Section
            if resume:
                p.setFont("Helvetica-Bold", 11)
                p.drawString(40, y, "Resume:")
                y -= 14
                p.setFont("Helvetica", 10)
                for key, value in resume.items():
                    if key in ["_id", "student_id"]:
                        continue
                    p.drawString(60, y, f"{key}: {value}")
                    y -= 12
                    if y < 60:
                        p.showPage()
                        y = height - 40

            y -= 20  # Space before next applicant

        p.save()
        buffer.seek(0)
        return buffer.read()

    async def update_student_status(self, student_id: str, job_id: str, status: str):
        try:
            result = await self.application_form_collection.update_one(
                {"student_id": student_id, "job_id": job_id},
                {"$set": {"student_status": status}}
            )
            if result.matched_count == 0:
                raise Exception("Application not found")
            return {"msg": "Status updated"}
        except Exception as e:
            raise Exception(f"Error updating student status: {str(e)}")

application_form_mgr = ApplicationFormMgr()




