import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Sparkles, Users, XCircle } from 'lucide-react'
import api from '../../api/axios'
import { CLASS_OPTIONS, formatClassLabel } from '../../constants/classes'
import { extractErrorMessage } from '../../utils/error'

const todayDate = () => new Date().toISOString().split('T')[0]

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
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(todayDate())
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attendance, setAttendance] = useState({})

  const presentCount = useMemo(
    () => Object.values(attendance).filter((status) => status === 'PRESENT').length,
    [attendance]
  )
  const absentCount = useMemo(
    () => Object.values(attendance).filter((status) => status === 'ABSENT').length,
    [attendance]
  )

  const handleLoadStudents = async () => {
    if (!selectedClass || !selectedDate) {
      setError('Please select both class and date')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/admin/attendance/students/${selectedClass}/${selectedDate}`)
      setStudents(response.data)
      setAttendance({})
    } catch (err) {
      setError(extractErrorMessage(err))
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSubmit = async () => {
    if (Object.keys(attendance).length === 0) {
      setError('Please mark attendance for at least one student')
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload = {
        class: selectedClass,
        date: selectedDate,
        attendances: Object.entries(attendance).map(([studentId, status]) => ({
          student_id: parseInt(studentId, 10),
          status,
        })),
      }

      await api.post('/admin/attendance/mark', payload)
      setSuccess('Attendance marked successfully')
      setAttendance({})
      setStudents([])
      setSelectedClass('')
      setSelectedDate(todayDate())
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Attendance board
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Attendance
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Load a class, mark presence quickly, and submit the day with a cleaner roll-call workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Selected day</p>
            <p className="mt-1 text-sm font-semibold text-white">{selectedDate || 'Not set'}</p>
          </div>
        </div>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} label="Students Loaded" value={students.length} tone="blue" />
        <SummaryCard icon={CheckCircle2} label="Present Marked" value={presentCount} tone="emerald" />
        <SummaryCard icon={XCircle} label="Absent Marked" value={absentCount} tone="rose" />
        <SummaryCard icon={CalendarDays} label="Class Focus" value={selectedClass ? formatClassLabel(selectedClass) : 'None'} tone="blue" />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Selection Panel</p>
          <h2 className="text-xl font-bold text-slate-900">Choose class and date</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map((classValue) => (
                <option key={classValue} value={classValue}>
                  {formatClassLabel(classValue)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleLoadStudents}
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Load Students'}
            </button>
          </div>
        </div>
      </section>

      {students.length > 0 && (
        <>
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Roll Call</p>
              <h3 className="text-lg font-bold text-slate-900">Mark each student</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-slate-100/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Student ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className={`border-t border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-slate-800">{student.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${attendance[student.id] === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${attendance[student.id] === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Submit Attendance'}
          </button>
        </>
      )}

      {students.length === 0 && selectedClass && selectedDate && !loading && (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">No students found for this class</h3>
          <p className="mt-2 text-sm text-slate-600">
            Try another class or confirm that students exist for the selected date.
          </p>
        </section>
      )}
    </div>
  )
}

export default Attendance
