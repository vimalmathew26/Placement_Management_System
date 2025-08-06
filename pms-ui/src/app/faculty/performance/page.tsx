'use client'
import Link from "next/link"
import { Card } from "@heroui/react"
import { useApi } from "@/app/hooks/useApi"
import { useState, useEffect } from "react"

interface PerformanceStats {
  studentCount: number
  placedCount: number
  activeCompanies: number
  averagePackage: number
}

export default function PerformanceDashboard() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const { get } = useApi()

  useEffect(() => {
    const fetchStats = async () => {
      const data = await get('/api/performances/stats')
      setStats(data as PerformanceStats)
    }
    fetchStats()
  }, [get])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Performance Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/faculty/performance/students">
          <Card className="p-6 hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Student Performances</h2>
            <p className="text-gray-600">
              View and manage student academic performances, skills, and placement status
            </p>
          </Card>
        </Link>
        <Link href="/faculty/performance/companies">
          <Card className="p-6 hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Company Performances</h2>
            <p className="text-gray-600">
              Track company hiring statistics, packages, and recruitment trends
            </p>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{stats?.studentCount || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Placed Students</h3>
          <p className="text-2xl font-bold">{stats?.placedCount || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Companies</h3>
          <p className="text-2xl font-bold">{stats?.activeCompanies || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Package</h3>
          <p className="text-2xl font-bold">₹{stats?.averagePackage || 0}L</p>
        </Card>
      </div>
    </div>
  )
}