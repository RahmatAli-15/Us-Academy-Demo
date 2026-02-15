import { useEffect, useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import api from '../../api/axios'
import Reveal from '../../components/public/Reveal'

const Notices = () => {
  const [pdfs, setPdfs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setError('')
        const response = await api.get('/public/pdfs')
        const sorted = [...response.data].sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
        setPdfs(sorted)
      } catch (err) {
        setError('Unable to load notices at the moment.')
      } finally {
        setLoading(false)
      }
    }

    fetchPdfs()
  }, [])

  const categories = useMemo(() => ['ALL', ...new Set(pdfs.map((item) => item.category))], [pdfs])
  const filtered = selectedCategory === 'ALL' ? pdfs : pdfs.filter((pdf) => pdf.category === selectedCategory)

  return (
    <div className="bg-[#F5F3EF]">
      <section className="bg-[#0B1E3F] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Notices</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">Latest Circulars and Announcements</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] transition ${selectedCategory === category ? 'bg-[#0B1E3F] text-white' : 'bg-white text-[#0B1E3F] hover:bg-[#ebe6da]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        {loading && <div className="mt-8 rounded-2xl bg-white p-6 text-sm text-[#374151] shadow-sm">Loading notices...</div>}
        {error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <div className="rounded-2xl bg-white p-6 text-sm text-[#374151] shadow-sm md:col-span-2 lg:col-span-3">
                No notices available in this category.
              </div>
            )}
            {filtered.map((notice, index) => (
              <Reveal key={notice.id} delay={index * 70}>
                <article className="h-full rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="inline-flex rounded-full bg-[#0B1E3F]/8 px-3 py-1 text-xs font-semibold tracking-[0.1em] text-[#0B1E3F]">
                    {notice.category}
                  </span>
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-[#0B1E3F]">{notice.title}</h3>
                  <p className="mt-3 text-sm text-[#6b7280]">{new Date(notice.upload_date).toLocaleDateString()}</p>
                  <a
                    href={`${api.defaults.baseURL}/${notice.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C6A75E] transition hover:gap-3"
                  >
                    <FileText size={16} />
                    View
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Notices
