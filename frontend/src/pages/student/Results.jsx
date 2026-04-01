import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Filter, Sparkles, Trophy } from 'lucide-react'
import api from '../../api/axios'

const SUBJECT_LABELS = {
  ENGLISH: 'English',
  ENGLISH_GRAMMAR: 'English Grammar',
  HINDI: 'Hindi',
  HINDI_GRAMMAR: 'Hindi Grammar',
  MATHS: 'Maths',
  EVS_SCIENCE: 'E.V.S / Science',
  SCIENCE: 'Science',
  URDU: 'Urdu',
  COMPUTER: 'Computer',
  GK: 'GK',
  MS_SST: 'M.S. / SST',
  SOCIAL_STUDIES: 'Social Studies',
  PT: 'P.T.',
  PHYSICAL_EDUCATION: 'Physical Education',
  ART: 'Art',
}

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
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

const Results = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterExamType, setFilterExamType] = useState('')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const response = await api.get('/student/results')
      setResults(response.data)
    } catch (err) {
      setError('Failed to load results')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = filterExamType
    ? results.filter((r) => r.exam_type === filterExamType)
    : results

  const examTypes = [...new Set(results.map((r) => r.exam_type))]
  const averageMarks = useMemo(
    () =>
      filteredResults.length > 0
        ? Math.round(filteredResults.reduce((sum, result) => sum + (result.marks || 0), 0) / filteredResults.length)
        : 0,
    [filteredResults]
  )

  if (loading) return <div className="py-10 text-center text-slate-500">Loading results...</div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} />
            Academic view
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            My results
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Review your subjects, compare exam performance, and keep an eye on your overall progress.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon={BookOpen} label="Subjects Listed" value={filteredResults.length} tone="blue" />
        <SummaryCard icon={Trophy} label="Average Marks" value={averageMarks} tone="emerald" />
        <SummaryCard icon={Filter} label="Exam Filter" value={filterExamType || 'All'} tone="amber" />
      </section>

      {results.length > 0 && (
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Exam Filter</p>
            <h2 className="text-xl font-bold text-slate-900">Choose an exam type</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterExamType('')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !filterExamType ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {examTypes.map((exam) => (
              <button
                key={exam}
                onClick={() => setFilterExamType(exam)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filterExamType === exam ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Marks Table</p>
          <h3 className="text-lg font-bold text-slate-900">Exam results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Marks</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Exam Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                    {results.length === 0 ? 'No results found' : 'No results for selected exam type'}
                  </td>
                </tr>
              ) : (
                filteredResults.map((result, index) => (
                  <tr key={result.id} className={`border-t border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{SUBJECT_LABELS[result.subject] || result.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        result.marks >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : result.marks >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {result.marks}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{result.exam_type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Results
