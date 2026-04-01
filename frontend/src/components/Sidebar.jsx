import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ role, isOpen = false, onClose = () => {} }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const adminMenu = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Attendance', href: '/admin/attendance', icon: Calendar },
    { label: 'Fees', href: '/admin/fees', icon: DollarSign },
    { label: 'Results', href: '/admin/results', icon: BookOpen },
    { label: 'PDFs', href: '/admin/pdfs', icon: FileText },
  ]

  const studentMenu = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/student/profile', icon: User },
    { label: 'Attendance', href: '/student/attendance', icon: Calendar },
    { label: 'Fees', href: '/student/fees', icon: DollarSign },
    { label: 'Results', href: '/student/results', icon: BookOpen },
    { label: 'PDFs', href: '/student/pdfs', icon: FileText },
  ]

  const menu = role === 'admin' ? adminMenu : studentMenu
  const menuLabel = role === 'admin' ? 'Admin menu' : 'Student menu'

  useEffect(() => {
    onClose()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      <div
        className={`fixed inset-0 top-16 z-30 bg-slate-950/45 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#172033_100%)] text-white shadow-2xl transition-transform duration-300 md:w-64 md:translate-x-0 md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Navigation</p>
            <p className="mt-1 text-sm text-slate-300">{menuLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-100 transition hover:bg-white/15"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 p-3 md:p-4">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.95)]'
                    : 'text-slate-300 hover:bg-white/8'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3 md:p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl bg-red-600 px-4 py-3 text-white transition-colors whitespace-nowrap hover:bg-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
