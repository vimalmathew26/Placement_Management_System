from fastapi import APIRouter
from typing import List
from pms.models import CompanyPerformance
from pms.services import company_performance_service

router = APIRouter()

@router.get("/companies", response_model=List[CompanyPerformance])
async def get_company_performances():
    return await company_performance_service.get_all()

@router.get("/companies/{company_id}", response_model=CompanyPerformance)
async def get_company_performance(company_id: str):
    return await company_performance_service.get_by_id(company_id)

@router.post("/companies", response_model=CompanyPerformance)
async def create_company_performance(performance: CompanyPerformance):
    return await company_performance_service.create(performance)