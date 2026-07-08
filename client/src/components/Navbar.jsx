import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-surface-2 hover:bg-accent-soft transition overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="moon"
            initial={{ y: -16, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
            className="w-5 h-5 text-accent"
            fill="currentColor" viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ y: -16, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25 }}
            className="w-5 h-5 text-accent"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Navbar({ active }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 md:px-10 py-4 shadow-theme bg-surface sticky top-0 z-50"
    >
      <Link to="/" className="text-xl font-bold text-accent tracking-tight">EventSphere</Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-secondary font-medium items-center">
        <Link to="/events" className={`hover:text-accent transition ${active === 'events' ? 'text-accent font-semibold' : ''}`}>
          Events
        </Link>
        {user ? (
          <>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hover:text-accent transition">
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="border border-theme text-secondary px-5 py-2 rounded-lg hover:bg-surface-2 transition text-sm font-medium">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-accent transition">Login</Link>
            <Link to="/signup" className="bg-accent text-white px-5 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition">Sign Up</Link>
          </>
        )}
        <ThemeToggle />
      </div>

      {/* Mobile: toggle + hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-secondary transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-secondary transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-secondary transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-surface shadow-lg border-t border-theme px-6 py-4 flex flex-col gap-3 md:hidden"
          >
            <Link to="/events" onClick={() => setMenuOpen(false)} className="text-secondary font-medium py-2 hover:text-accent">Events</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}
                  className="text-secondary font-medium py-2 hover:text-accent">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-400 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-secondary font-medium py-2 hover:text-accent">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="bg-accent text-white px-5 py-2 rounded-lg text-center hover:bg-[var(--accent-hover)]">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}