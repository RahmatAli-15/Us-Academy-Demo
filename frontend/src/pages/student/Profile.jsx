import { useEffect, useState } from 'react'
import { CalendarDays, Mail, MapPin, Phone, ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react'
import api from '../../api/axios'
import { formatClassLabel } from '../../constants/classes'

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
      <Icon size={18} className="text-slate-600" />
    </div>
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value || '-'}</p>
  </div>
)

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await api.get('/student/me')
      setProfile(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-slate-500">Loading profile...</div>

  if (!profile) {
    return (
      <div className="py-10 text-center text-slate-500">
        Profile not found
      </div>
    )
  }

  const profilePhotoUrl = profile.profile_photo_url
    ? `${api.defaults.baseURL}${profile.profile_photo_url}`
    : null
  const studentClass = profile.class_ ?? profile.class ?? profile.class_number ?? '-'

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_28%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
            <Sparkles size={14} />
            Profile space
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Student profile
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            View your account information, personal details, and school profile in one place.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
        <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] px-6 py-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex flex-col items-start">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={profile.name}
                  className="h-28 w-28 rounded-[28px] border-4 border-white bg-gray-200 object-cover object-center shadow-xl sm:h-32 sm:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border-4 border-white bg-slate-200 shadow-xl sm:h-32 sm:w-32">
                  <span className="text-3xl font-semibold text-slate-600 sm:text-4xl">
                    {profile.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
              )}
              </div>

              <div className="pb-1">
                <h2 className="text-3xl font-black text-white sm:text-4xl">{profile.name}</h2>
                <p className="mt-2 text-sm font-medium text-blue-100">Student ID: {profile.student_id}</p>
                <p className="mt-1 text-sm font-medium text-blue-100">
                  Class: {studentClass === '-' ? '-' : formatClassLabel(String(studentClass))}
                </p>
              </div>
            </div>

            <div className="xl:w-[420px]">
              <div className="rounded-[28px] border border-white/30 bg-white/95 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Account Information</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Profile summary</h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Student Record</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">Verified</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">School Access</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-600">Enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard icon={Mail} label="Email" value={profile.email || '-'} />
            <InfoCard icon={Phone} label="Phone" value={profile.phone || '-'} />
            <InfoCard icon={CalendarDays} label="Date of Birth" value={profile.dob || '-'} />
            <InfoCard icon={MapPin} label="Address" value={profile.address || '-'} />
            <InfoCard icon={ShieldCheck} label="Status" value="Active" />
            <InfoCard icon={UserCircle2} label="Profile Photo" value={profilePhotoUrl ? 'Uploaded' : 'Not uploaded'} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
