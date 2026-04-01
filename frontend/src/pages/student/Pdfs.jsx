import { useEffect, useState } from 'react'
import { Download, FileText, Filter, Sparkles } from 'lucide-react'
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

  const categories = [...new Set(pdfs.map((p) => p.category))]
  const filteredPdfs = selectedCategory
    ? pdfs.filter((p) => p.category === selectedCategory)
    : pdfs

  if (loading) return <div className="py-10 text-center text-slate-500">Loading documents...</div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_28%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} />
            Learning shelf
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Available documents
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Explore study material, notices, and useful school documents in one organized place.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {pdfs.length > 0 && (
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Category Filter</p>
              <h2 className="text-xl font-bold text-slate-900">Choose a document type</h2>
            </div>
            <Filter size={18} className="text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !selectedCategory ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {filteredPdfs.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">
            {pdfs.length === 0 ? 'No documents available' : 'No documents in this category'}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Try another category or check back later for more materials.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPdfs.map((pdf) => (
            <article
              key={pdf.id}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.34)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <FileText size={22} />
              </div>
              <h3 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900">{pdf.title}</h3>
              <p className="mt-2 text-sm text-slate-600">Category: <span className="font-semibold">{pdf.category}</span></p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                {new Date(pdf.upload_date).toLocaleDateString()}
              </p>
              <a
                href={`${api.defaults.baseURL}/${pdf.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Download size={16} /> Download
              </a>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

export default Pdfs
