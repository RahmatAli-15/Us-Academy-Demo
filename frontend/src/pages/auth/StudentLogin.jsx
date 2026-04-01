import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, GraduationCap, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/student/login', {
        student_id: studentId,
        dob,
      })
      const { access_token, role } = response.data

      login(access_token, {
        student_id: studentId,
        role,
      })

      navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ecfeff_0%,#f8fafc_30%,#f0fdf4_100%)]">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_28%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm backdrop-blur">
                  <Sparkles size={14} />
                  Student access
                </div>
                <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950">
                  Step into your school dashboard with a simple, friendly login.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                  Use your student ID and date of birth to view attendance, results, fees, profile details, and learning materials.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <GraduationCap size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Your school space</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Access all your student information from one clear and comfortable dashboard.</p>
                  </div>

                  <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <BookOpen size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Study and progress</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Keep track of marks, attendance, and documents without any clutter.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/92 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="bg-[linear-gradient(135deg,#064e3b_0%,#10b981_52%,#38bdf8_100%)] px-6 py-6 text-white sm:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">Student Portal</p>
                      <h2 className="mt-3 text-3xl font-black tracking-tight">Student Login</h2>
                      <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                        Sign in with your student ID and date of birth to continue.
                      </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <CalendarDays size={26} />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Student ID</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        placeholder="Enter your student ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:bg-gray-400"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </form>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    Use your student ID and registered date of birth to access your account.
                  </div>

                  <div className="mt-6 text-center">
                    <Link to="/" className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800">
                      Back to website
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
