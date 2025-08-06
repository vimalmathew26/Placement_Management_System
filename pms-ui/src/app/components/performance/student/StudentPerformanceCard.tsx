import { Card, CardHeader } from "@heroui/react"
import { StudentPerformance } from "@/../src/types/performance"

interface StudentPerformanceCardProps {
  performance: StudentPerformance
}

export function StudentPerformanceCard({ performance }: StudentPerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{performance.student_id}</h3>
        <p className="text-sm text-gray-500">Semester {performance.semester}</p>
      </CardHeader>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Academic Performance</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <p className="text-xs text-gray-500">10th CGPA</p>
                <p className="font-medium">{performance.tenth_cgpa || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">12th CGPA</p>
                <p className="font-medium">{performance.twelth_cgpa || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Degree CGPA</p>
                <p className="font-medium">{performance.degree_cgpa || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Status</p>
                <p className="font-medium">{performance.current_status}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Skills</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {performance.skills?.map((skill, index) => (
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