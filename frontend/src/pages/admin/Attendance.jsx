import { useState } from 'react'
import api from '../../api/axios'
import { extractErrorMessage } from '../../utils/error'

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attendance, setAttendance] = useState({})

  const handleLoadStudents = async () => {
    if (!selectedClass || !selectedDate) {
      setError('Please select both class and date')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/admin/attendance/students/${selectedClass}/${selectedDate}`)
      setStudents(response.data)
      setAttendance({})
    } catch (err) {
      setError(extractErrorMessage(err))
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmit = async () => {
    if (Object.keys(attendance).length === 0) {
      setError('Please mark attendance for at least one student')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setError('Date must be in YYYY-MM-DD format')
      return
    }

    setSaving(true)
    setError('')
    try {
      const formattedDate = selectedDate
      const attendances = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: parseInt(studentId, 10),
        status: String(status).toUpperCase()
      }))

      const payload = {
        class: selectedClass,
        date: formattedDate,
        attendances
      }

      console.log('Attendance submit payload:', payload)

      await api.post('/admin/attendance/mark', payload)
      setSuccess('Attendance marked successfully')
      setAttendance({})
      setStudents([])
      setSelectedClass(null)
      setSelectedDate('')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Class</label>
          <select
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
          >
            <option value="">Select Class</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleLoadStudents}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Load Students'}
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={attendance[student.id] || ''}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                          required
                        >
                          <option value="">Select</option>
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                          <option value="HOLIDAY">Holiday</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Submit Attendance'}
          </button>
        </>
      )}

      {students.length === 0 && selectedClass && selectedDate && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          No students found for this class
        </div>
      )}
    </div>
  )
}

export default Attendance
