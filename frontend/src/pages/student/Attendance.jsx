import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/student/attendance')
      setAttendance(response.data)
    } catch (err) {
      setError('Failed to load attendance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const presentCount = attendance.filter(a => a.status === 'PRESENT').length
  const absentCount = attendance.filter(a => a.status === 'ABSENT').length
  const totalClasses = attendance.length

  if (loading) {
    return <div className="text-center py-8">Loading attendance...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Attendance</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium text-sm">Total Classes</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalClasses}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium text-sm">Present</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{presentCount}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-medium text-sm">Absent</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{absentCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-gray-600">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map(record => (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Attendance
