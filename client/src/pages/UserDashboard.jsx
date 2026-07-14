import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyRegistrations, updateProfile } from '../api'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/Navbar'
import NotificationBell from '../components/NotificationBell'
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

const AVATAR_COLORS = [
  { label: 'Indigo', bg: 'bg-indigo-600', hex: '#4f46e5' },
  { label: 'Violet', bg: 'bg-violet-500', hex: '#8b5cf6' },
  { label: 'Pink', bg: 'bg-pink-500', hex: '#ec4899' },
  { label: 'Rose', bg: 'bg-rose-500', hex: '#f43f5e' },
  { label: 'Orange', bg: 'bg-orange-500', hex: '#f97316' },
  { label: 'Emerald', bg: 'bg-emerald-500', hex: '#10b981' },
  { label: 'Cyan', bg: 'bg-cyan-500', hex: '#06b6d4' },
  { label: 'Slate', bg: 'bg-slate-600', hex: '#475569' },
]

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-400' }
  if (score === 4) return { score, label: 'Good', color: 'bg-blue-400' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, setUser, logout } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editTab, setEditTab] = useState('profile')
  const [editName, setEditName] = useState('')
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [securityError, setSecurityError] = useState('')
  const [securitySuccess, setSecuritySuccess] = useState('')
  const [savingSecurity, setSavingSecurity] = useState(false)

  const storedColorKey = user ? `avatarColor_${user.id}` : null

  useEffect(() => {
    if (!user) return navigate('/login')
    fetchRegistrations()
    if (storedColorKey) {
      const saved = localStorage.getItem(storedColorKey)
      if (saved) {
        const found = AVATAR_COLORS.find(c => c.hex === saved)
        if (found) setAvatarColor(found)
      }
    }
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

  const openEditModal = () => {
    setEditName(user?.name || '')
    setEditTab('profile')
    setProfileError(''); setProfileSuccess('')
    setSecurityError(''); setSecuritySuccess('')
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setShowEditModal(true)
  }

  const handleSaveProfile = async () => {
    setProfileError(''); setProfileSuccess('')
    if (!editName.trim()) return setProfileError('Name cannot be empty.')
    setSavingProfile(true)
    try {
      const res = await updateProfile({ name: editName.trim() })
      setUser(res.data)
      localStorage.setItem(storedColorKey, avatarColor.hex)
      setProfileSuccess('Profile updated!')
      setTimeout(() => setShowEditModal(false), 1200)
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveSecurity = async () => {
    setSecurityError(''); setSecuritySuccess('')
    if (!currentPassword) return setSecurityError('Enter your current password.')
    if (!newPassword) return setSecurityError('Enter a new password.')
    if (newPassword.length < 6) return setSecurityError('New password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return setSecurityError('New passwords do not match.')
    if (newPassword === currentPassword) return setSecurityError('New password must be different from current.')
    setSavingSecurity(true)
    try {
      await updateProfile({ currentPassword, newPassword })
      setSecuritySuccess('Password changed successfully!')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => setShowEditModal(false), 1400)
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSavingSecurity(false)
    }
  }

  const strength = getPasswordStrength(newPassword)
  const passwordsMatch = confirmPassword && newPassword === confirmPassword

  const currentAvatarColor = (() => {
    if (storedColorKey) {
      const saved = localStorage.getItem(storedColorKey)
      if (saved) {
        const found = AVATAR_COLORS.find(c => c.hex === saved)
        if (found) return found
      }
    }
    return AVATAR_COLORS[0]
  })()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'My Events' },
    { id: 'explore', label: 'Explore' },
    { id: 'profile', label: 'Profile' },
  ]

  // ─── Tab Content Renderers ───────────────────────────────────────

  const renderDashboard = () => (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-secondary text-sm mt-1">Here's what's happening with your events.</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Registered Events', value: registrations.length, color: 'bg-accent' },
          { label: 'Upcoming', value: upcoming.length, color: 'bg-blue-500' },
          { label: 'Cancelled', value: cancelled.length, color: 'bg-gray-400 dark:bg-gray-600' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="bg-surface rounded-2xl p-5 shadow-theme flex items-center gap-4">
            <div className={`${s.color} w-2 h-10 rounded-full flex-shrink-0`}></div>
            <div>
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-secondary text-sm">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="bg-surface rounded-2xl shadow-elegant p-6 mb-6">         <div className="flex items-center justify-between mb-6">           <h2 className="font-display text-base font-semibold text-primary">My Registered Events</h2>
          <Link to="/events" className="text-accent text-sm hover:underline">Browse more →</Link>
        </div>
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary text-sm">No registrations yet.</p>
            <Link to="/events" className="text-accent text-sm hover:underline mt-2 inline-block">Browse events →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.slice(0, 3).map((reg) => (
              <motion.div key={reg._id} variants={fadeUp}
                whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}
                className="bg-accent-soft border border-theme rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold text-primary text-sm">{reg.event?.title}</h3>
                  <p className="text-secondary text-xs mt-0.5">{reg.event?.date} · {reg.event?.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${reg.status === 'confirmed' ? 'bg-accent' : 'bg-gray-400 dark:bg-gray-600'} text-white text-xs px-3 py-1 rounded-full capitalize`}>
                    {reg.status}
                  </span>
                  <Link to={`/events/${reg.event?._id}`} className="text-accent text-xs hover:underline font-medium">View</Link>
                </div>
              </motion.div>
            ))}
            {registrations.length > 3 && (
              <button onClick={() => setActive('events')} className="text-accent text-sm hover:underline w-full text-center pt-2">
                View all {registrations.length} registrations →
              </button>
            )}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-surface rounded-2xl shadow-elegant p-6">         <h2 className="font-display text-base font-semibold text-primary mb-5">My Profile</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div style={{ backgroundColor: currentAvatarColor.hex }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-primary">{user?.name}</p>
            <p className="text-secondary text-sm">{user?.email}</p>
            <span className="text-xs text-accent font-medium bg-accent-soft px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={openEditModal}
            className="border border-theme text-secondary px-4 py-2 rounded-xl text-sm hover:bg-surface-2 transition self-start sm:self-auto">
            Edit Profile
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )

  const renderMyEvents = () => (
    <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">My Events</h1>
        <p className="text-secondary text-sm mt-1">All events you've registered for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: registrations.length, color: 'bg-accent' },
          { label: 'Confirmed', value: upcoming.length, color: 'bg-blue-500' },
          { label: 'Cancelled', value: cancelled.length, color: 'bg-gray-400 dark:bg-gray-600' },
        ].map((s, i) => (
          <div key={i} className="bg-surface rounded-2xl p-4 shadow-theme flex items-center gap-3">
            <div className={`${s.color} w-2 h-8 rounded-full flex-shrink-0`}></div>
            <div>
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-secondary text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl shadow-theme p-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎟️</p>
            <p className="text-primary font-semibold mb-1">No registrations yet</p>
            <p className="text-secondary text-sm mb-4">Browse events and register for ones you're interested in.</p>
            <Link to="/events" className="bg-accent text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--accent-hover)] transition inline-block">
              Browse Events
            </Link>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {registrations.map((reg) => (
              <motion.div key={reg._id} variants={fadeUp}
                whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}
                className="border border-theme rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-accent hover:bg-accent-soft transition"
              >
                <div className="flex items-center gap-4">
                  <div style={{ backgroundColor: currentAvatarColor.hex }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {reg.event?.title?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">{reg.event?.title}</h3>
                    <p className="text-secondary text-xs mt-0.5">{reg.event?.date} · {reg.event?.location}</p>
                    <p className="text-muted text-xs">{reg.event?.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`${reg.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-surface-2 text-secondary'} text-xs px-3 py-1 rounded-full capitalize font-medium`}>
                    {reg.status}
                  </span>
                  <Link to={`/events/${reg.event?._id}`}
                    className="bg-accent text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition font-medium">
                    View →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )

  const renderProfile = () => (
    <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">My Profile</h1>
        <p className="text-secondary text-sm mt-1">Manage your account details.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-theme p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }}
            style={{ backgroundColor: currentAvatarColor.hex }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-primary">{user?.name}</h2>
            <p className="text-secondary text-sm mt-1">{user?.email}</p>
            <span className="text-xs text-accent font-medium bg-accent-soft px-3 py-1 rounded-full mt-2 inline-block capitalize">{user?.role}</span>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={openEditModal}
            className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--accent-hover)] transition">
            Edit Profile
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl shadow-theme p-5">
          <p className="text-xs text-secondary font-medium uppercase tracking-wide mb-1">Full Name</p>
          <p className="text-primary font-semibold">{user?.name}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow-theme p-5">
          <p className="text-xs text-secondary font-medium uppercase tracking-wide mb-1">Email Address</p>
          <p className="text-primary font-semibold">{user?.email}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow-theme p-5">
          <p className="text-xs text-secondary font-medium uppercase tracking-wide mb-1">Account Role</p>
          <p className="text-primary font-semibold capitalize">{user?.role}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow-theme p-5">
          <p className="text-xs text-secondary font-medium uppercase tracking-wide mb-1">Events Registered</p>
          <p className="text-primary font-semibold">{registrations.length}</p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-theme flex">

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className={`fixed md:sticky top-0 h-screen w-60 bg-surface shadow-theme flex flex-col py-8 px-4 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Link to="/" className="text-xl font-bold text-accent mb-10 px-2 tracking-tight">EventSphere</Link>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => {
                if (item.id === 'explore') {
                  navigate('/events')
                } else {
                  setActive(item.id)
                }
                setSidebarOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${active === item.id ? 'bg-accent text-white' : 'text-secondary hover:bg-surface-2 hover:text-primary'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 mb-2 flex items-center gap-3">
          <ThemeToggle />
          <NotificationBell align="top-right" />
        </div>
        <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-left transition">
          Logout
        </button>
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-surface shadow-theme sticky top-0 z-10">
          <span className="text-lg font-bold text-accent">EventSphere</span>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={() => setSidebarOpen(true)} className="flex flex-col gap-1.5 p-2">
              <span className="block w-6 h-0.5 bg-secondary"></span>
              <span className="block w-6 h-0.5 bg-secondary"></span>
              <span className="block w-6 h-0.5 bg-secondary"></span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {active === 'dashboard' && renderDashboard()}
            {active === 'events' && renderMyEvents()}
            {active === 'profile' && renderProfile()}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 pt-6 pb-0">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-lg font-semibold text-primary">Edit Profile</h2>
                  <button onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2 text-secondary hover:text-primary transition text-lg">
                    ×
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 bg-surface-2 rounded-2xl">
                  <motion.div
                    animate={{ backgroundColor: avatarColor.hex }}
                    transition={{ duration: 0.3 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0"
                  >
                    {(editTab === 'profile' ? editName : user?.name)?.charAt(0)?.toUpperCase() || '?'}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{editTab === 'profile' ? editName || user?.name : user?.name}</p>
                    <p className="text-secondary text-xs">{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-1 bg-surface-2 rounded-xl p-1 mb-6">
                  {[{ id: 'profile', label: 'Profile Info' }, { id: 'security', label: 'Security' }].map(tab => (
                    <button key={tab.id}
                      onClick={() => { setEditTab(tab.id); setProfileError(''); setProfileSuccess(''); setSecurityError(''); setSecuritySuccess('') }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${editTab === tab.id ? 'bg-surface text-primary shadow-theme' : 'text-secondary hover:text-primary'}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  {editTab === 'profile' ? (
                    <motion.div key="profile"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.18 }}>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-1">Display Name</label>
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-theme rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-2">Avatar Color</label>
                          <div className="flex gap-2 flex-wrap">
                            {AVATAR_COLORS.map(color => (
                              <motion.button key={color.hex} whileTap={{ scale: 0.9 }}
                                onClick={() => setAvatarColor(color)}
                                style={{ backgroundColor: color.hex }}
                                className={`w-8 h-8 rounded-xl transition-all ${avatarColor.hex === color.hex ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                                title={color.label} />
                            ))}
                          </div>
                          <p className="text-xs text-secondary mt-2">Selected: {avatarColor.label}</p>
                        </div>
                        {profileError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs bg-red-50 dark:bg-red-950/40 dark:text-red-300 px-3 py-2 rounded-lg">{profileError}</motion.p>}
                        {profileSuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-xs bg-green-50 dark:bg-green-950/40 dark:text-green-300 px-3 py-2 rounded-lg">✓ {profileSuccess}</motion.p>}
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveProfile} disabled={savingProfile}
                          className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition text-sm flex items-center justify-center">
                          {savingProfile ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                          ) : 'Save Profile'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="security"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-1">Current Password</label>
                          <div className="relative">
                            <input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••"
                              className="w-full border border-theme rounded-xl px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary" />
                            <button type="button" onClick={() => setShowCurrent(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary text-xs font-medium">
                              {showCurrent ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-1">New Password</label>
                          <div className="relative">
                            <input type={showNew ? 'text' : 'password'} value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                              className="w-full border border-theme rounded-xl px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary" />
                            <button type="button" onClick={() => setShowNew(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary text-xs font-medium">
                              {showNew ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          {newPassword && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                              <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-surface-2'}`} />
                                ))}
                              </div>
                              <p className={`text-xs font-medium ${strength.score <= 1 ? 'text-red-400' : strength.score <= 3 ? 'text-yellow-500' : strength.score === 4 ? 'text-blue-500' : 'text-green-600'}`}>
                                {strength.label}
                              </p>
                            </motion.div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-1">Confirm New Password</label>
                          <div className="relative">
                            <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                              className={`w-full border rounded-xl px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 bg-theme text-primary transition ${confirmPassword ? (passwordsMatch ? 'border-green-400 focus:ring-green-300' : 'border-red-300 focus:ring-red-200') : 'border-theme focus:ring-indigo-400'}`} />
                            <button type="button" onClick={() => setShowConfirm(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary text-xs font-medium">
                              {showConfirm ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          {confirmPassword && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className={`text-xs mt-1 font-medium ${passwordsMatch ? 'text-green-500' : 'text-red-400'}`}>
                              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </motion.p>
                          )}
                        </div>
                        {securityError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs bg-red-50 dark:bg-red-950/40 dark:text-red-300 px-3 py-2 rounded-lg">{securityError}</motion.p>}
                        {securitySuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-xs bg-green-50 dark:bg-green-950/40 dark:text-green-300 px-3 py-2 rounded-lg">✓ {securitySuccess}</motion.p>}
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveSecurity} disabled={savingSecurity}
                          className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition text-sm flex items-center justify-center">
                          {savingSecurity ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                          ) : 'Update Password'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}