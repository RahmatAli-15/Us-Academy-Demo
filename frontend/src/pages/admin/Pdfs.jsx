import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Download, FileText, FolderOpen, Plus, Sparkles, Trash2, Upload } from 'lucide-react'
import api from '../../api/axios'

const categoryOptions = [
  { label: 'Notice', value: 'NOTICE' },
  { label: 'Datesheet', value: 'DATESHEET' },
  { label: 'Circular', value: 'CIRCULAR' },
  { label: 'Study Material', value: 'STUDY_MATERIAL' }
]

const categoryStyles = {
  NOTICE: 'bg-blue-50 text-blue-700 ring-blue-200',
  DATESHEET: 'bg-amber-50 text-amber-700 ring-amber-200',
  CIRCULAR: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  STUDY_MATERIAL: 'bg-violet-50 text-violet-700 ring-violet-200',
}

const formatCategory = (value) => categoryOptions.find((option) => option.value === value)?.label || value

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    violet: 'from-violet-500/15 to-fuchsia-500/10 text-violet-700 ring-violet-200',
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-4 ring-1`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-900">{value}</p>
    </div>
  )
}

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

  const categoryCounts = useMemo(
    () =>
      categoryOptions.reduce((acc, option) => {
        acc[option.value] = pdfs.filter((pdf) => pdf.category === option.value).length
        return acc
      }, {}),
    [pdfs]
  )

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

  if (loading) return <div className="py-10 text-center text-slate-500">Loading...</div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Document control desk
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              PDF library
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Keep notices, circulars, datesheets, and study material organized in one clean admin view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Library size</p>
              <p className="mt-1 text-sm font-semibold text-white">{pdfs.length} document{pdfs.length === 1 ? '' : 's'}</p>
            </div>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={18} /> {showForm ? 'Close Upload' : 'Upload PDF'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={BookOpen} label="Total PDFs" value={pdfs.length} tone="blue" />
        <SummaryCard icon={FolderOpen} label="Notices" value={categoryCounts.NOTICE || 0} tone="amber" />
        <SummaryCard icon={FileText} label="Circulars" value={categoryCounts.CIRCULAR || 0} tone="emerald" />
        <SummaryCard icon={Upload} label="Study Material" value={categoryCounts.STUDY_MATERIAL || 0} tone="violet" />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">
          {success}
        </div>
      )}

      {showForm && (
        <section className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Upload Center</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Add a new document to the library</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="PDF Title"
                value={formData.title}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
              className="mt-4 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-slate-600 shadow-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-medium file:text-white hover:border-blue-300"
              required
            />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-gray-400"
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFile(null)
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-stone-100 px-6 py-3 font-semibold text-stone-900 transition hover:bg-stone-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {pdfs.length === 0 && (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">No documents uploaded yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Start building the PDF library by uploading your first file.
          </p>
        </section>
      )}

      {pdfs.length > 0 && (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Library Grid</p>
            <h2 className="text-xl font-bold text-slate-900">All uploaded documents</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pdfs.map((pdf) => (
              <article
                key={pdf.id}
                className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.34)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                    <FileText size={22} />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${categoryStyles[pdf.category] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                    {formatCategory(pdf.category)}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">{pdf.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Uploaded document ready for download and admin management.
                </p>

                {pdf.upload_date && (
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {new Date(pdf.upload_date).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`${api.defaults.baseURL}/${pdf.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Download size={16} /> Download
                  </a>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Pdfs
