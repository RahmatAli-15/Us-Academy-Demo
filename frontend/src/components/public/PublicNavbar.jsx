import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'Notices', to: '/notices' },
  { label: 'Contact', to: '/contact' },
]

const PublicNavbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setLoginOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed top-0 z-50 w-full bg-[#0B1E3F]/90 shadow-2xl backdrop-blur-lg">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="group">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C6A75E]">US Academy</p>
          <p className="text-xl font-semibold text-white transition group-hover:text-[#C6A75E]">School</p>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition duration-300 ${location.pathname === item.to ? 'text-[#C6A75E]' : 'text-white hover:text-[#C6A75E]'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative hidden md:block">
          <button
            onClick={() => setLoginOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-[#C6A75E] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[#C6A75E] hover:text-[#0B1E3F]"
          >
            Login <ChevronDown size={16} />
          </button>
          {loginOpen && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[#C6A75E]/40 bg-[#0B1E3F]/95 shadow-2xl backdrop-blur-lg">
              <Link to="/login/admin" className="block px-4 py-3 text-sm text-white transition hover:bg-[#C6A75E]/15 hover:text-[#C6A75E]">
                Admin Login
              </Link>
              <Link to="/login/student" className="block px-4 py-3 text-sm text-white transition hover:bg-[#C6A75E]/15 hover:text-[#C6A75E]">
                Student Login
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen((prev) => !prev)} className="rounded-full border border-[#C6A75E]/50 p-2 text-white md:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0B1E3F]/95 px-6 pb-6 pt-4 backdrop-blur-lg md:hidden">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm transition duration-300 ${location.pathname === item.to ? 'text-[#C6A75E]' : 'text-white hover:bg-white/10 hover:text-[#C6A75E]'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <Link to="/login/admin" className="rounded-lg bg-[#C6A75E] px-4 py-2 text-center text-sm font-semibold text-[#0B1E3F]">
              Admin Login
            </Link>
            <Link to="/login/student" className="rounded-lg border border-[#C6A75E]/50 px-4 py-2 text-center text-sm font-semibold text-[#F5F3EF]">
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default PublicNavbar
