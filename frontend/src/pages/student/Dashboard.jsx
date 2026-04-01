import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, BookOpen, FileText, Sparkles, TrendingUp } from 'lucide-react'
import api from '../../api/axios'

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue', subtext }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    rose: 'from-rose-500/15 to-red-500/10 text-rose-700 ring-rose-200',
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-5 ring-1`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 shadow-sm">
        <Icon size={22} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-stone-900">{value}</p>
      {subtext && <p className="mt-2 text-sm text-stone-600">{subtext}</p>}
    </div>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    attendance_percentage: 0,
    average_marks: 0,
    pending_fees: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [attendanceRes, resultsRes, feesRes] = await Promise.all([
        api.get('/student/attendance'),
        api.get('/student/results'),
        api.get('/student/fees'),
      ])

      const attendanceData = attendanceRes.data
      const resultsData = resultsRes.data
      const feesData = feesRes.data

      const attendancePercentage = attendanceData.length > 0
        ? Math.round((attendanceData.filter((a) => a.status === 'PRESENT').length / attendanceData.length) * 100)
        : 0

      const averageMarks = resultsData.length > 0
        ? Math.round(resultsData.reduce((sum, r) => sum + (r.average || 0), 0) / resultsData.length)
        : 0

      const pendingFees = feesData.reduce((sum, f) => sum + (f.amount_pending || 0), 0)

      setStats({
        attendance_percentage: attendancePercentage,
        average_marks: averageMarks,
        pending_fees: pendingFees,
      })
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  if (loading) return <div className="py-10 text-center text-slate-500">Loading dashboard...</div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} />
            Student home
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Student dashboard
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Keep track of attendance, progress, fees, and study materials from one calm, focused space.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon={TrendingUp} label="Attendance" value={`${stats.attendance_percentage}%`} tone="blue" subtext="Your overall attendance percentage" />
        <SummaryCard icon={BookOpen} label="Average Marks" value={stats.average_marks} tone="emerald" subtext="Average performance across available results" />
        <SummaryCard icon={AlertCircle} label="Pending Fees" value={`Rs ${formatCurrency(stats.pending_fees)}`} tone="rose" subtext="Outstanding payment amount" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Quick Links</p>
              <h2 className="text-xl font-bold text-slate-900">Jump to what you need</h2>
            </div>
            <ArrowRight size={18} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            <Link to="/student/profile" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>View Profile</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/student/attendance" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Check Attendance</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/student/results" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>View Results</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/student/fees" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Fee Details</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/student/pdfs" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Study Materials</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Updates</p>
              <h2 className="text-xl font-bold text-slate-900">Helpful reminders</h2>
            </div>
            <FileText size={18} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="font-semibold text-slate-900">New study materials available</p>
              <p className="mt-1 text-sm text-slate-600">Check the PDFs section for the latest resources and notices.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="font-semibold text-slate-900">Attendance matters</p>
              <p className="mt-1 text-sm text-slate-600">Regular attendance helps keep your overall progress strong.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="font-semibold text-slate-900">Fee follow-up</p>
              <p className="mt-1 text-sm text-slate-600">Review pending dues and keep your account in good standing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
