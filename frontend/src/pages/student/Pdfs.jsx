import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import api from '../../api/axios'

const Pdfs = () => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchPdfs()
  }, [])

  const fetchPdfs = async () => {
    try {
      const response = await api.get('/pdfs')
      setPdfs(response.data)
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(pdfs.map(p => p.category))]
  const filteredPdfs = selectedCategory
    ? pdfs.filter(p => p.category === selectedCategory)
    : pdfs

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Documents</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {pdfs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                !selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          Loading documents...
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          {pdfs.length === 0 ? 'No documents available' : 'No documents in selected category'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map(pdf => (
            <div key={pdf.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{pdf.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Category: <span className="font-medium">{pdf.category}</span></p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(pdf.upload_date).toLocaleDateString()}
              </p>
              <a
                href={`${api.defaults.baseURL}/${pdf.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Download size={16} /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Pdfs
