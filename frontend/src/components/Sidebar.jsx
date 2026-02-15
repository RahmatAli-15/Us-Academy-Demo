import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
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

const Sidebar = ({ role }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
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

  return (
    <aside className="fixed left-0 top-16 z-40 w-full bg-gray-800 text-white overflow-x-auto overflow-y-hidden md:w-64 md:h-[calc(100vh-64px)] md:overflow-y-auto md:overflow-x-hidden flex md:flex-col">
      <nav className="p-3 md:p-4 flex gap-2 md:space-y-2 md:block flex-1">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 md:p-4 border-l border-gray-700 md:border-l-0 md:border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
