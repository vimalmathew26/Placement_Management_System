import  StudentPerformanceList from '@/components/performance/student/StudentPerformanceList'
import { Card } from '@heroui/react'

export default function StudentPerformancePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Performances</h1>
      </div>
      <Card className="p-4">
        <StudentPerformanceList />
      </Card>
    </div>
  )
}