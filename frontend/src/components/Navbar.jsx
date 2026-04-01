import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Navbar = ({ onSidebarToggle, sidebarOpen = false }) => {
  const { isAuthenticated, user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student' || user?.profile_photo_url) {
      return
    }

    let ignore = false

    const loadStudentHeaderData = async () => {
      try {
        const response = await api.get('/student/me')
        if (ignore) return

        updateUser({
          name: response.data?.name,
          student_id: response.data?.student_id,
          profile_photo_url: response.data?.profile_photo_url,
        })
      } catch {
        // Keep header usable even if profile enrichment fails.
      }
    }

    loadStudentHeaderData()

    return () => {
      ignore = true
    }
  }, [isAuthenticated, updateUser, user?.profile_photo_url, user?.role])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const profilePhotoUrl =
    user?.role === 'student' && user?.profile_photo_url
      ? `${api.defaults.baseURL}${user.profile_photo_url}`
      : null

  const welcomeLabel = user?.role === 'student'
    ? `Welcome, ${user?.name || 'Student'}`
    : `Welcome, ${user?.username || user?.student_id || 'User'}`

  const renderStudentAvatar = () => {
    if (user?.role !== 'student') return null

    if (profilePhotoUrl) {
      return (
        <span
          className="inline-flex h-8 w-8 overflow-hidden rounded-full border border-blue-100 bg-blue-50"
          style={{ width: '32px', height: '32px', minWidth: '32px' }}
        >
          <img
            src={profilePhotoUrl}
            alt={user?.name || 'Student'}
            className="h-full w-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </span>
      )
    }

    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
        style={{ width: '32px', height: '32px', minWidth: '32px' }}
      >
        {(user?.name || 'S').charAt(0).toUpperCase()}
      </div>
    )
  }

  const renderAuthenticatedUser = () => (
    <>
      <div className="flex items-center gap-3">
        {renderStudentAvatar()}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{welcomeLabel}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </>
  )

  const renderMobileAuthenticatedAvatar = () => (
    <div className="md:hidden">
      {renderStudentAvatar()}
    </div>
  )

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-lg">
      <div className="mx-auto w-full max-w-none px-4 md:container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={onSidebarToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
                aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link to="/" className="whitespace-nowrap text-xl font-bold leading-none text-blue-600 sm:text-2xl">
              US Academy
            </Link>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {!isAuthenticated ? (
              <>
                <Link to="/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                  Contact
                </Link>
                <Link to="/notices" className="text-gray-700 hover:text-blue-600">
                  Notices
                </Link>
                <button
                  onClick={() => navigate('/login/admin')}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => navigate('/login/student')}
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Student Login
                </button>
              </>
            ) : (
              renderAuthenticatedUser()
            )}
          </div>

          {isAuthenticated && renderMobileAuthenticatedAvatar()}

          {!isAuthenticated && (
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {!isAuthenticated && isOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            <>
              <Link
                to="/about"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
              <Link
                to="/notices"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Notices
              </Link>
              <button
                onClick={() => {
                  navigate('/login/admin')
                  setIsOpen(false)
                }}
                className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Admin Login
              </button>
              <button
                onClick={() => {
                  navigate('/login/student')
                  setIsOpen(false)
                }}
                className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Student Login
              </button>
            </>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
