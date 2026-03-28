import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyRegistrations } from '../api'
import { useAuth } from '../context/AuthContext'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) return navigate('/login')
    fetchRegistrations()
  }, [user])

  const fetchRegistrations = async () => {
    try {
      const res = await getMyRegistrations()
      setRegistrations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }
  const upcoming = registrations.filter(r => r.status === 'confirmed')
  const cancelled = registrations.filter(r => r.status === 'cancelled')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'My Events' },
    { id: 'explore', label: 'Explore' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className={`fixed md:sticky top-0 h-screen w-60 bg-white shadow-sm flex flex-col py-8 px-4 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Link to="/" className="text-xl font-bold text-indigo-600 mb-10 px-2 tracking-tight">EventSphere</Link>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { item.id === 'explore' ? navigate('/events') : setActive(item.id); setSidebarOpen(false) }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${active === item.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-400 hover:bg-red-50 rounded-xl text-left transition">
          Logout
        </button>
      </motion.div>

      {/* Main */}
      <div className="flex-1 min-w-0">

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
          <span className="text-lg font-bold text-indigo-600">EventSphere</span>
          <button onClick={() => setSidebarOpen(true)} className="flex flex-col gap-1.5 p-2">
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-gray-400 text-sm mt-1">Here's what's happening with your events.</p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Registered Events', value: registrations.length, color: 'bg-indigo-600' },
              { label: 'Upcoming Events', value: upcoming.length, color: 'bg-blue-500' },
              { label: 'Cancelled', value: cancelled.length, color: 'bg-gray-400' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`${s.color} w-2 h-10 rounded-full flex-shrink-0`}></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-gray-400 text-sm">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Registered Events */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-800">My Registered Events</h2>
              <Link to="/events" className="text-indigo-600 text-sm hover:underline">Browse more →</Link>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">No registrations yet.</p>
                <Link to="/events" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">Browse events →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <motion.div key={reg._id} variants={fadeUp}
                    whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{reg.event?.title}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{reg.event?.date} · {reg.event?.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${reg.status === 'confirmed' ? 'bg-indigo-600' : 'bg-gray-400'} text-white text-xs px-3 py-1 rounded-full capitalize`}>
                        {reg.status}
                      </span>
                      <Link to={`/events/${reg.event?._id}`} className="text-indigo-600 text-xs hover:underline font-medium">View</Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-base font-bold text-gray-800 mb-5">My Profile</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <motion.div whileHover={{ scale: 1.05 }}
                className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span>
              </div>
              <motion.button whileTap={{ scale: 0.97 }}
                className="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition self-start sm:self-auto">
                Edit Profile
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}