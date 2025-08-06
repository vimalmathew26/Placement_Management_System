'use client'
import { useState, useEffect } from 'react'
import { StudentPerformanceCard } from './StudentPerformanceCard'
import { useApi } from "@/app/hooks/useApi"
import { StudentPerformance } from "@/../src/types/performance"

const StudentPerformanceList = () => {
  const [performances, setPerformances] = useState<StudentPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const { get } = useApi()

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const data = await get('/api/performances/students')
        setPerformances(data as StudentPerformance[])
      } catch (error) {
        console.error('Failed to fetch student performances:', error)
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
        <StudentPerformanceCard 
          key={performance._id} 
          performance={performance} 
        />
      ))}
    </div>
  )
}

export default StudentPerformanceList
