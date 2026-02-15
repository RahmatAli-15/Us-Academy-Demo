import { useState, useEffect } from 'react'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import api from '../../api/axios'
import { extractErrorMessage } from '../../utils/error'

const MARK_SUBJECTS = ['hindi', 'english', 'maths', 'science', 'social_studies', 'physical_education', 'art']
const SUBJECT_KEY_MAP = {
  HINDI: 'hindi',
  ENGLISH: 'english',
  MATHS: 'maths',
  SCIENCE: 'science',
  SOCIAL_STUDIES: 'social_studies',
  PHYSICAL_EDUCATION: 'physical_education',
  ART: 'art',
}

const groupResultsByExam = (records) => {
  const grouped = {}

  records.forEach((record) => {
    const groupKey = `${record.student_id}-${record.exam_type}`
    const subjectField = SUBJECT_KEY_MAP[record.subject]

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        id: record.id,
        student_id: record.student_id,
        exam_type: record.exam_type,
        hindi: 0,
        english: 0,
        maths: 0,
        science: 0,
        social_studies: 0,
        physical_education: 0,
        art: 0,
      }
    }

    if (subjectField) {
      grouped[groupKey][subjectField] = record.marks
    }
  })

  return Object.values(grouped)
}

const Results = () => {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [filterExam, setFilterExam] = useState('All')
  const [formData, setFormData] = useState({
    student_id: '',
    exam_type: 'Final',
    hindi: 0,
    english: 0,
    maths: 0,
    science: 0,
    social_studies: 0,
    physical_education: 0,
    art: 0
  })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (showForm) {
      fetchStudents()
    }
  }, [showForm])

  useEffect(() => {
    fetchResultsBySelection()
  }, [selectedClass, selectedStudentId])

  const fetchResultsBySelection = async () => {
    if (!selectedClass && !selectedStudentId) {
      setResults([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    try {
      let response
      if (selectedStudentId) {
        response = await api.get(`/admin/results/student/${selectedStudentId}`)
      } else {
        response = await api.get(`/admin/results/class/${selectedClass}`)
      }
      setResults(groupResultsByExam(response.data || []))
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
    setSaving(true)
    setError('')
    try {
      const studentId = Number(formData.student_id)
      const selectedStudent = students.find((student) => student.id === studentId)
      const studentClass = selectedClass ?? selectedStudent?.class

      if (!studentId || Number.isNaN(studentId)) {
        setError('Please select a valid student')
        return
      }

      if (!studentClass) {
        setError('Student class is required')
        return
      }

      const payload = {
        student_id: studentId,
        student_class: String(studentClass),
        exam_type: formData.exam_type,
        marks: {
          HINDI: Number(formData.hindi ?? 0),
          ENGLISH: Number(formData.english ?? 0),
          MATHS: Number(formData.maths ?? 0),
          SCIENCE: Number(formData.science ?? 0),
          SOCIAL_STUDIES: Number(formData.social_studies ?? 0),
          PHYSICAL_EDUCATION: Number(formData.physical_education ?? 0),
          ART: Number(formData.art ?? 0),
        }
      }

      console.log('Submitting payload:', payload)

      if (editing) {
        await api.put(`/admin/results/${editing}`, payload)
        setSuccess('Result updated successfully')
      } else {
        await api.post('/admin/results', payload)
        setSuccess('Result added successfully')
      }

      resetForm()
      fetchResultsBySelection()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      student_id: '',
      exam_type: 'Final',
      hindi: 0,
      english: 0,
      maths: 0,
      science: 0,
      social_studies: 0,
      physical_education: 0,
      art: 0
    })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (result) => {
    setFormData({
      student_id: Number(result.student_id),
      exam_type: result.exam_type,
      hindi: result.hindi,
      english: result.english,
      maths: result.maths,
      science: result.science,
      social_studies: result.social_studies,
      physical_education: result.physical_education,
      art: result.art
    })
    setEditing(result.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return

    try {
      await api.delete(`/admin/results/${id}`)
      setSuccess('Result deleted successfully')
      fetchResultsBySelection()
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const fetchStudents = async () => {
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

  const filteredResults = results.filter(r => filterExam === 'All' || r.exam_type === filterExam)

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Results</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Result
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

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Result</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="student_id"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    student_id: e.target.value ? Number(e.target.value) : '',
                  }))
                }
                disabled={studentsLoading}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
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
              <select
                name="exam_type"
                value={formData.exam_type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
              >
                <option>Final</option>
                <option>Mid Term</option>
                <option>Unit Test</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {MARK_SUBJECTS.map(subject => (
                <input
                  key={subject}
                  type="number"
                  name={subject}
                  placeholder={subject.replace(/_/g, ' ').toUpperCase()}
                  value={formData[subject] ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [subject]: Number(e.target.value),
                    }))
                  }
                  min="0"
                  max="100"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={selectedClass || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value, 10) : null
            setSelectedClass(value)
            if (value) setSelectedStudentId('')
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
        >
          <option value="">Filter by Class</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cls) => (
            <option key={cls} value={cls}>
              Class {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedStudentId}
          onChange={(e) => {
            const value = e.target.value
            setSelectedStudentId(value)
            if (value) setSelectedClass(null)
          }}
          disabled={studentsLoading}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
        >
          <option value="">
            {studentsLoading ? 'Loading students...' : 'Filter by Student'}
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.student_id} - {student.name}
            </option>
          ))}
        </select>

        <select
          value={filterExam}
          onChange={(e) => setFilterExam(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
        >
          <option>All</option>
          <option>Final</option>
          <option>Mid Term</option>
          <option>Unit Test</option>
        </select>
      </div>

      {!selectedClass && !selectedStudentId && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          Select class or student to view results.
        </div>
      )}

      {(selectedClass || selectedStudentId) && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Exam</th>
                {['Hindi', 'English', 'Maths', 'Science', 'S. Studies', 'P.E', 'Art'].map(h => (
                  <th key={h} className="px-3 py-3 text-center text-sm font-medium text-gray-700">{h}</th>
                ))}
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => (
                <tr key={result.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{result.student_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{result.exam_type}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.hindi}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.english}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.maths}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.science}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.social_studies}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.physical_education}</td>
                  <td className="px-3 py-4 text-center text-sm">{result.art}</td>
                  <td className="px-6 py-4 text-center text-sm flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(result)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {(selectedClass || selectedStudentId) && filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </div>
  )
}

export default Results
