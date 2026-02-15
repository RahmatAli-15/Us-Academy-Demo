import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import api from '../../api/axios'
import { extractErrorMessage } from '../../utils/error'

const Fees = () => {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    paid_amount: '',
    remark: '',
  })

  useEffect(() => {
    // Fees would need a list endpoint on backend
    // For now, we'll leave it empty until user searches
  }, [])

  useEffect(() => {
    if (showModal) {
      fetchStudentsForDropdown()
    }
  }, [showModal])

  const fetchStudentsForDropdown = async () => {
    setStudentsLoading(true)
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data || [])
    } catch (err) {
      setError(extractErrorMessage(err))
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    try {
      const studentsResponse = await api.get('/admin/students')
      const allStudents = studentsResponse.data || []

      const matchedStudent = allStudents.find(
        (student) =>
          String(student.student_id).toLowerCase() === searchTerm.trim().toLowerCase()
      )

      if (!matchedStudent) {
        setFees([])
        setError('Student not found')
        return
      }

      const feesResponse = await api.get(`/admin/fees/student/${matchedStudent.id}`)
      setFees(feesResponse.data || [])
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        student_id: parseInt(formData.student_id, 10),
        amount: parseFloat(formData.amount),
        paid_amount: parseFloat(formData.paid_amount),
        remark: formData.remark,
      }

      if (editingId) {
        await api.put(`/admin/fees/${editingId}`, payload)
        setSuccess('Fee updated successfully')
      } else {
        await api.post('/admin/fees', payload)
        setSuccess('Fee record created successfully')
      }

      setShowModal(false)
      setFormData({ student_id: '', amount: '', paid_amount: '', remark: '' })
      setEditingId(null)
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleEdit = (fee) => {
    setFormData({
      student_id: String(fee.student_id),
      amount: fee.amount,
      paid_amount: fee.paid_amount,
      remark: fee.remark,
    })
    setEditingId(fee.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return
    
    try {
      await api.delete(`/admin/fees/${id}`)
      setSuccess('Fee record deleted successfully')
      setFees(fees.filter(f => f.id !== id))
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleAddNew = () => {
    setFormData({ student_id: '', amount: '', paid_amount: '', remark: '' })
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fees Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Fee
        </button>
      </div>

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

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Fees</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by student ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Fee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Paid</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Due</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                    No fees found
                  </td>
                </tr>
              ) : (
                fees.map(fee => (
                  <tr key={fee.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Student #{fee.student_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{fee.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{fee.paid_amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{fee.due_amount}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(fee)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fee.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Fee' : 'Add Fee'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Student ID</label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  disabled={editingId || studentsLoading}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="">
                    {studentsLoading ? 'Loading students...' : 'Select Student'}
                  </option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.student_id} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Paid Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Remark</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Add'} Fee
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fees
