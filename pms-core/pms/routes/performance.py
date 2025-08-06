from fastapi import APIRouter, Depends
from typing import List
from pms.models.student_performance import StudentPerformance
from ..models.companyperformance import CompanyPerformance
from pms.services.student_performance_services import StudentPerformanceMgr
from ..services.company_performance_service import CompanyPerformanceService

router = APIRouter(prefix="/api/performances", tags=["performances"])

student_service = StudentPerformanceMgr()
company_service = CompanyPerformanceService()

@router.get("/students", response_model=List[StudentPerformance])
async def get_student_performances():
    return await student_service.get_all()

@router.get("/companies", response_model=List[CompanyPerformance])
async def get_company_performances():
    return await company_service.get_all()

@router.get("/students/{id}", response_model=StudentPerformance)
async def get_student_performance(id: str):
    return await student_service.get_by_id(id)

@router.get("/companies/{id}", response_model=CompanyPerformance)
async def get_company_performance(id: str):
    return await company_service.get_by_id(id)