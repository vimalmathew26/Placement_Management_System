import { Card, CardHeader } from "@heroui/react"
import { CompanyPerformance } from "@/../src/types/performance"

interface CompanyPerformanceCardProps {
  performance: CompanyPerformance
}

export function CompanyPerformanceCard({ performance }: CompanyPerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{performance.company_id}</h3>
        <p className="text-sm text-gray-500">Year {performance.year}</p>
      </CardHeader>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Hiring Statistics</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <p className="text-xs text-gray-500">Students Hired</p>
                <p className="font-medium">{performance.students_hired}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="font-medium">{performance.placement_success_rate}%</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Package Details</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <p className="text-xs text-gray-500">Average Package</p>
                <p className="font-medium">₹{performance.average_package}L</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Highest Package</p>
                <p className="font-medium">₹{performance.highest_package}L</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Preferred Skills</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {performance.preferred_skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
    </Card>
  )
}