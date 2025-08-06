from typing import List, Optional
from pms.models.companyperformance import CompanyPerformance
from pms.db.database import DatabaseConnection

class CompanyPerformanceService:
    def __init__(self):
        self.collection_name = "company_performances"
        self.db_connection = DatabaseConnection()

    async def create(self, performance: CompanyPerformance) -> CompanyPerformance:
        db = await self.db_connection.get_database()
        result = await db[self.collection_name].insert_one(performance.model_dump())
        performance.id = str(result.inserted_id)
        return performance

    async def get_all(self) -> List[CompanyPerformance]:
        db = await self.db_connection.get_database()
        performances = await db[self.collection_name].find().to_list(None)
        return [CompanyPerformance(**p) for p in performances]

    async def get_by_id(self, id: str) -> Optional[CompanyPerformance]:
        db = await self.db_connection.get_database()
        performance = await db[self.collection_name].find_one({"_id": id})
        return CompanyPerformance(**performance) if performance else None

    async def get_by_company(self, company_id: str) -> List[CompanyPerformance]:
        db = await self.db_connection.get_database()
        performances = await db[self.collection_name].find({"company_id": company_id}).to_list(None)
        return [CompanyPerformance(**p) for p in performances]

    async def update(self, id: str, performance: CompanyPerformance) -> Optional[CompanyPerformance]:
        db = await self.db_connection.get_database()
        await db[self.collection_name].update_one(
            {"_id": id},
            {"$set": performance.dict(exclude={"id"})}
        )
        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        db = await self.db_connection.get_database()
        result = await db[self.collection_name].delete_one({"_id": id})
        return result.deleted_count > 0

    async def get_yearly_stats(self, year: int) -> dict:
        db = await self.db_connection.get_database()
        pipeline = [
            {"$match": {"year": year}},
            {"$group": {
                "_id": None,
                "total_hired": {"$sum": "$students_hired"},
                "avg_package": {"$avg": "$average_package"},
                "max_package": {"$max": "$highest_package"},
            }}
        ]
        result = await db[self.collection_name].aggregate(pipeline).to_list(None)
        return result[0] if result else {}