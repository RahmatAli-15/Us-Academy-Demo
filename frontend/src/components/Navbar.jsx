import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            US Academy
          </Link>

          <div className="hidden md:flex gap-6 items-center">
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => navigate('/login/student')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Student Login
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700">
                  Welcome, {user?.username || user?.student_id}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-blue-600 py-2"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-blue-600 py-2"
                >
                  Contact
                </Link>
                <Link
                  to="/notices"
                  className="block text-gray-700 hover:text-blue-600 py-2"
                >
                  Notices
                </Link>
                <button
                  onClick={() => {
                    navigate('/login/admin')
                    setIsOpen(false)
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => {
                    navigate('/login/student')
                    setIsOpen(false)
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Student Login
                </button>
              </>
            ) : (
              <>
                <span className="block text-gray-700 py-2">
                  Welcome, {user?.username || user?.student_id}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
