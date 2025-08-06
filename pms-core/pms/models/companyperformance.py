from typing import Optional, List, Literal
from pydantic import BaseModel

class CompanyPerformance(BaseModel):
    company_id: str
    year: int
    students_hired: int
    average_package: float
    highest_package: float
    roles_offered: List[str]
    hiring_status: Literal["Active", "Inactive", "Blacklisted"]
    placement_success_rate: float  # percentage of selected vs appeared
    feedback_rating: Optional[float]  # company feedback from placed students
    interview_rounds: List[str]
    preferred_skills: List[str]
    remarks: Optional[str]