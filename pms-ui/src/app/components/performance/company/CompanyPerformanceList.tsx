'use client'
import { useState, useEffect } from 'react'
import { CompanyPerformanceCard } from './CompanyPerformanceCard'
import { useApi } from "@/app/hooks/useApi"
import { CompanyPerformance } from "@/../src/types/performance"

export function CompanyPerformanceList() {
  const [performances, setPerformances] = useState<CompanyPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const { get } = useApi()

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const data = await get('/api/performances/companies')
        setPerformances(data as CompanyPerformance[])
      } catch (error) {
        console.error('Failed to fetch company performances:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformances()
  }, [get])

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {performances.map((performance) => (
        <CompanyPerformanceCard 
          key={performance._id} 
          performance={performance} 
        />
      ))}
    </div>
  )
}