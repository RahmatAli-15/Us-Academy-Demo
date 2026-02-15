import { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import api from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    today_attendance_percentage: 0,
    total_fees_collected: 0,
    total_pending_fees: 0,
    total_pdfs: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setError('')
      const response = await api.get('/admin/dashboard/summary')
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard statistics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total_students}</p>
            </div>
            <Users size={40} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Today's Attendance</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {Number(stats.today_attendance_percentage || 0).toFixed(2)}%
              </p>
            </div>
            <TrendingUp size={40} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Fees Collected</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">₹{formatCurrency(stats.total_fees_collected)}</p>
            </div>
            <DollarSign size={40} className="text-purple-200" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-sm">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">₹{formatCurrency(stats.total_pending_fees)}</p>
            </div>
            <AlertCircle size={40} className="text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/admin/students" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              &rarr; Manage Students
            </a>
            <a href="/admin/attendance" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              &rarr; Mark Attendance
            </a>
            <a href="/admin/fees" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              &rarr; Manage Fees
            </a>
            <a href="/admin/results" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              &rarr; Manage Results
            </a>
            <a href="/admin/pdfs" className="block px-4 py-2 hover:bg-blue-50 rounded text-blue-600 font-medium">
              &rarr; Upload Documents
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Database: Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">API Server: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
