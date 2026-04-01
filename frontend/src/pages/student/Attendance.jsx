import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Sparkles, Users, XCircle } from 'lucide-react'
import api from '../../api/axios'

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    rose: 'from-rose-500/15 to-red-500/10 text-rose-700 ring-rose-200',
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

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/student/attendance')
      setAttendance(response.data)
    } catch (err) {
      setError('Failed to load attendance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const presentCount = useMemo(() => attendance.filter((a) => a.status === 'PRESENT').length, [attendance])
  const absentCount = useMemo(() => attendance.filter((a) => a.status === 'ABSENT').length, [attendance])
  const totalClasses = attendance.length

  if (loading) return <div className="py-10 text-center text-slate-500">Loading attendance...</div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} />
            Attendance tracker
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            My attendance
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Review your attendance history and understand how regularly you have been present in class.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon={Users} label="Total Classes" value={totalClasses} tone="blue" />
        <SummaryCard icon={CheckCircle2} label="Present" value={presentCount} tone="emerald" />
        <SummaryCard icon={XCircle} label="Absent" value={absentCount} tone="rose" />
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Attendance Log</p>
          <h3 className="text-lg font-bold text-slate-900">Daily records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center text-slate-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={record.id} className={`border-t border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-6 py-4 text-sm text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        record.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.status === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
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

export default Attendance
