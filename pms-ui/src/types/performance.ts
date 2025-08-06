export interface StudentPerformance {
  _id: string
  student_id: string
  semester: number
  tenth_cgpa?: number
  twelth_cgpa?: number
  degree_cgpa?: number
  mca_cgpa?: number[]
  skills?: string[]
  current_status: 'Studying' | 'Working' | 'Others'
  linkedin_url?: string
}

export interface CompanyPerformance {
  _id: string
  company_id: string
  year: number
  students_hired: number
  average_package: number
  highest_package: number
  roles_offered: string[]
  hiring_status: 'Active' | 'Inactive' | 'Blacklisted'
  placement_success_rate: number
  preferred_skills: string[]
}