import { useState, useEffect } from 'react'
import { Download, Trash2, Plus } from 'lucide-react'
import api from '../../api/axios'

const categoryOptions = [
  { label: 'Notice', value: 'NOTICE' },
  { label: 'Datesheet', value: 'DATESHEET' },
  { label: 'Circular', value: 'CIRCULAR' },
  { label: 'Study Material', value: 'STUDY_MATERIAL' }
]

const Pdfs = () => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'NOTICE'
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPdfs()
  }, [])

  const loadPdfs = async () => {
    try {
      const response = await api.get('/pdfs/admin/all')
      setPdfs(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load PDFs')
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
    if (!formData.title || !file) {
      setError('Please fill all fields')
      return
    }

    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('category', formData.category)
      data.append('file', file)

      console.log('File object:', file)

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1])
      }

      await api.post('/pdfs/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('PDF uploaded successfully')
      setFormData({ title: '', category: 'NOTICE' })
      setFile(null)
      setShowForm(false)
      loadPdfs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this PDF?')) return

    try {
      await api.delete(`/pdfs/${id}`)
      setSuccess('PDF deleted successfully')
      loadPdfs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete PDF')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Upload PDF
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload PDF</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                placeholder="PDF Title"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.map(pdf => (
          <div key={pdf.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-900 mb-2">{pdf.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{pdf.category}</p>
            <div className="flex gap-3">
              <a
                href={`${api.defaults.baseURL}/${pdf.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Download size={16} /> Download
              </a>
              <button
                onClick={() => handleDelete(pdf.id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {pdfs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No PDFs uploaded yet</p>
        </div>
      )}
    </div>
  )
}

export default Pdfs
