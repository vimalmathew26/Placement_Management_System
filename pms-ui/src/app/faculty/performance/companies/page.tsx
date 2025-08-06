import { CompanyPerformanceList } from '@/components/performance/company/CompanyPerformanceList'
import { Card } from '@heroui/react'

export default function CompanyPerformancePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Performances</h1>
      </div>
      <Card className="p-4">
        <CompanyPerformanceList />
      </Card>
    </div>
  )
}