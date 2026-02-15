import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import api from '../../api/axios'
import { extractErrorMessage } from '../../utils/error'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    dob: '',
    aadhaar_number: '',
    father_name: '',
    mother_name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/students/class/${selectedClass}`)
      setStudents(response.data)
      setError('')
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
      if (editingId) {
        await api.put(`/admin/students/${editingId}`, formData)
        setSuccess('Student updated successfully')
      } else {
        const response = await api.post('/admin/students', formData)
        const generatedStudentId = response?.data?.student_id
        if (generatedStudentId) {
          setSuccess(`Student created successfully with ID: ${generatedStudentId}`)
        } else {
          setSuccess('Student created successfully')
        }
      }
      setShowModal(false)
      setFormData({
        name: '',
        class: '',
        dob: '',
        aadhaar_number: '',
        father_name: '',
        mother_name: '',
        phone: '',
        address: '',
      })
      setEditingId(null)
      if (selectedClass) {
        fetchStudents()
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      class: student.class_,
      dob: student.dob,
      aadhaar_number: student.aadhaar_number,
      father_name: student.father_name,
      mother_name: student.mother_name,
      phone: student.phone,
      address: student.address,
    })
    setEditingId(student.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    
    try {
      await api.delete(`/admin/students/${id}`)
      setSuccess('Student deleted successfully')
      if (selectedClass) {
        fetchStudents()
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleAddNew = () => {
    setFormData({
      name: '',
      class: selectedClass || '',
      dob: '',
      aadhaar_number: '',
      father_name: '',
      mother_name: '',
      phone: '',
      address: '',
    })
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Student
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
        <label className="block text-gray-700 font-medium mb-2">Filter by Class</label>
        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
        >
          <option value="">Select a class</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(cls => (
            <option key={cls} value={cls}>Class {cls}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-600">
                      No students found in this class.
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.phone}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Student' : 'Add Student'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Aadhaar</label>
                  <input
                    type="text"
                    name="aadhaar_number"
                    value={formData.aadhaar_number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Father Name</label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Mother Name</label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Add'} Student
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

export default Students
