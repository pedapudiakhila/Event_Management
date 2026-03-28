import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

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
      className="flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-white sticky top-0 z-50"
    >
      <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">EventSphere</Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-gray-600 font-medium items-center">
        <Link to="/events" className={`hover:text-indigo-600 transition ${active === 'events' ? 'text-indigo-600 font-semibold' : ''}`}>
          Events
        </Link>
        {user ? (
          <>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hover:text-indigo-600 transition">
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-600 transition">Login</Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
        <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 px-6 py-4 flex flex-col gap-3 md:hidden"
          >
            <Link to="/events" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2 hover:text-indigo-600">Events</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}
                  className="text-gray-600 font-medium py-2 hover:text-indigo-600">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-400 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-2 hover:text-indigo-600">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-center hover:bg-indigo-700">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}