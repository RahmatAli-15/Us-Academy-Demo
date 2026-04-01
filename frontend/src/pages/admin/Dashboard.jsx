import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, DollarSign, FileText, PlusCircle, Sparkles, TrendingUp, Users } from 'lucide-react'
import api from '../../api/axios'

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue', subtext }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
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
    total_students: 0,
    today_attendance_percentage: 0,
    total_fees_collected: 0,
    total_pending_fees: 0,
    total_pdfs: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setError('')
      const response = await api.get('/admin/dashboard/summary')
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard statistics')
      console.error(err)
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Administration hub
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Admin dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Watch the school snapshot at a glance and jump straight into the next important task.
            </p>
          </div>

          <Link
            to="/admin/students"
            state={{ openNew: true }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <PlusCircle size={18} />
            Add New Student
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} label="Total Students" value={stats.total_students} tone="blue" subtext="Registered across classes" />
        <SummaryCard icon={TrendingUp} label="Today's Attendance" value={`${Number(stats.today_attendance_percentage || 0).toFixed(2)}%`} tone="emerald" subtext="Current daily attendance rate" />
        <SummaryCard icon={DollarSign} label="Fees Collected" value={`Rs ${formatCurrency(stats.total_fees_collected)}`} tone="amber" subtext="Collection recorded so far" />
        <SummaryCard icon={AlertCircle} label="Pending Fees" value={`Rs ${formatCurrency(stats.total_pending_fees)}`} tone="rose" subtext="Outstanding balance to track" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Quick Links</p>
              <h2 className="text-xl font-bold text-slate-900">Common admin actions</h2>
            </div>
            <ArrowRight size={18} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            <Link to="/admin/students" state={{ openNew: true }} className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Add New Student</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/admin/students" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Manage Students</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/admin/attendance" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Mark Attendance</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/admin/fees" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Manage Fees</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/admin/results" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Manage Results</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/admin/pdfs" className="flex items-center justify-between rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Upload Documents</span>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">System Status</p>
              <h2 className="text-xl font-bold text-slate-900">Operational overview</h2>
            </div>
            <FileText size={18} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Database: Connected</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">API Server: Online</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Documents Available: {stats.total_pdfs || 0}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
