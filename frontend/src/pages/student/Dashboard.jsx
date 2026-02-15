import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle, BookOpen, FileText } from 'lucide-react'
import api from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    attendance_percentage: 0,
    average_marks: 0,
    pending_fees: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [attendanceRes, resultsRes, feesRes] = await Promise.all([
        api.get('/student/attendance'),
        api.get('/student/results'),
        api.get('/student/fees')
      ])

      const attendanceData = attendanceRes.data
      const resultsData = resultsRes.data
      const feesData = feesRes.data

      const attendancePercentage = attendanceData.length > 0
        ? Math.round((attendanceData.filter(a => a.status === 'PRESENT').length / attendanceData.length) * 100)
        : 0

      const averageMarks = resultsData.length > 0
        ? Math.round(resultsData.reduce((sum, r) => sum + (r.average || 0), 0) / resultsData.length)
        : 0

      const pendingFees = feesData.reduce((sum, f) => sum + (f.amount_pending || 0), 0)

      setStats({
        attendance_percentage: attendancePercentage,
        average_marks: averageMarks,
        pending_fees: pendingFees
      })
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Attendance</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.attendance_percentage}%</p>
            </div>
            <TrendingUp size={40} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Average Marks</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.average_marks}</p>
            </div>
            <BookOpen size={40} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">₹{stats.pending_fees}</p>
            </div>
            <AlertCircle size={40} className="text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/student/profile" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              → View Profile
            </a>
            <a href="/student/attendance" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              → Check Attendance
            </a>
            <a href="/student/results" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              → View Results
            </a>
            <a href="/student/fees" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              → Fee Details
            </a>
            <a href="/student/pdfs" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              → Study Materials
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Announcements</h2>
          <div className="space-y-3">
            <div className="pb-3 border-b">
              <p className="font-medium text-gray-900">📚 New Study Materials Available</p>
              <p className="text-sm text-gray-600 mt-1">Check the PDFs section for latest study materials</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-medium text-gray-900">📋 Mark your attendance</p>
              <p className="text-sm text-gray-600 mt-1">Regular attendance is important for your progress</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">💰 Outstanding Fees</p>
              <p className="text-sm text-gray-600 mt-1">Please clear pending fees as per schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
