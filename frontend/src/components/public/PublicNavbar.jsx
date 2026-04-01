import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
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

  useEffect(() => {
    setMenuOpen(false)
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

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login/student"
              className="rounded-full border border-[#C6A75E] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[#C6A75E] hover:text-[#0B1E3F]"
            >
              Student Login
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full border border-[#C6A75E]/50 p-2 text-white md:hidden"
          >
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
            <Link
              to="/login/student"
              className="rounded-lg border border-[#C6A75E]/50 px-4 py-2 text-center text-sm font-semibold text-[#F5F3EF]"
            >
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default PublicNavbar
