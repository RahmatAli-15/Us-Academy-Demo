import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSessionToken, setOtpSessionToken] = useState('')
  const [otpDeliveryEmail, setOtpDeliveryEmail] = useState('')
  const [otpMessage, setOtpMessage] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [resendingOtp, setResendingOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldownSeconds])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/admin/login', { username, password })
      const {
        access_token,
        role,
        requires_otp,
        otp_session_token,
        otp_delivery_email,
        cooldown_seconds,
        message,
      } = response.data

      if (requires_otp) {
        setOtpCode('')
        setOtpSessionToken(otp_session_token || '')
        setOtpDeliveryEmail(otp_delivery_email || '')
        setOtpMessage(message || '')
        setCooldownSeconds(Number(cooldown_seconds || 0))
        return
      }

      login(access_token, {
        username,
        role,
      })

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/admin/verify-otp', {
        otp_session_token: otpSessionToken,
        otp_code: otpCode,
      })
      const { access_token, role } = response.data

      login(access_token, {
        username,
        role,
      })

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!otpSessionToken || cooldownSeconds > 0 || resendingOtp) {
      return
    }

    setError('')
    setResendingOtp(true)

    try {
      const response = await api.post('/auth/admin/resend-otp', {
        otp_session_token: otpSessionToken,
      })
      const {
        otp_session_token,
        otp_delivery_email,
        cooldown_seconds,
        message,
      } = response.data

      setOtpSessionToken(otp_session_token || otpSessionToken)
      setOtpDeliveryEmail(otp_delivery_email || '')
      setOtpMessage('')
      setCooldownSeconds(Number(cooldown_seconds || 0))
    } catch (err) {
      const retryAfter = Number(err.response?.headers?.['retry-after'] || 0)
      if (retryAfter > 0) {
        setCooldownSeconds(retryAfter)
      }
      setError(err.response?.data?.detail || 'Unable to resend OTP right now')
    } finally {
      setResendingOtp(false)
    }
  }

  const resetOtpFlow = () => {
    setOtpCode('')
    setOtpSessionToken('')
    setOtpDeliveryEmail('')
    setOtpMessage('')
    setCooldownSeconds(0)
    setError('')
  }

  const isOtpStep = Boolean(otpSessionToken)

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_30%,#eff6ff_100%)]">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 shadow-sm backdrop-blur">
                  <Sparkles size={14} />
                  Secure admin access
                </div>
                <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950">
                  Manage the school from a calm, focused control desk.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                  Sign in to oversee students, attendance, fees, results, and school documents in one unified dashboard.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <ShieldCheck size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Protected admin entry</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Access operational tools with a cleaner and more secure sign-in flow.</p>
                  </div>

                  <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <LockKeyhole size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Fast dashboard access</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Jump straight into the admin panel without clutter or distraction.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/92 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#38bdf8_100%)] px-6 py-6 text-white sm:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Admin Portal</p>
                      <h2 className="mt-3 text-3xl font-black tracking-tight">Admin Login</h2>
                      <p className="mt-2 text-sm leading-6 text-blue-100/90">
                        Use your administrator credentials to continue into the dashboard.
                      </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <UserCircle2 size={26} />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                      {error}
                    </div>
                  )}

                  {!isOtpStep ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          placeholder="Enter your username"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          placeholder="Enter your password"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:bg-gray-400"
                      >
                        {loading ? 'Checking credentials...' : 'Continue'}
                        {!loading && <ArrowRight size={18} />}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">Check your email for the OTP</p>
                        <p className="mt-2 leading-6">
                          We sent a 6-digit OTP to {otpDeliveryEmail || 'your admin email address'}.
                          Enter that code below to finish login.
                        </p>
                        {otpMessage && (
                          <p className="mt-3 text-xs font-medium text-blue-800">{otpMessage}</p>
                        )}
                      </div>

                      <form onSubmit={handleOtpSubmit} className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Email OTP</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            placeholder="Enter 6-digit email OTP"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading || otpCode.length !== 6}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-[0_18px_40px_-20px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:bg-gray-400"
                        >
                          {loading ? 'Verifying OTP...' : 'Verify OTP'}
                          {!loading && <ArrowRight size={18} />}
                        </button>
                      </form>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">Need another code?</p>
                        <p className="mt-2 leading-6">
                          You can request a new OTP once the cooldown finishes. We also limit repeated requests to reduce spam.
                        </p>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={cooldownSeconds > 0 || resendingOtp}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          {resendingOtp
                            ? 'Sending new OTP...'
                            : cooldownSeconds > 0
                              ? `Resend OTP in ${cooldownSeconds}s`
                              : 'Resend OTP'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={resetOtpFlow}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Back to password step
                      </button>
                    </div>
                  )}

                  {!isOtpStep && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">Default credentials:</span> admin / Admin@123
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <Link to="/" className="text-sm font-medium text-blue-700 transition hover:text-blue-800">
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

export default AdminLogin
