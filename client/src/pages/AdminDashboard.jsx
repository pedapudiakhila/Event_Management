import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getEvents, createEvent, updateEvent, deleteEvent, getAllRegistrations } from '../api'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/Navbar'
import NotificationBell from '../components/NotificationBell'

const emptyForm = { title: '', description: '', category: 'Technology', date: '', time: '10:00 AM', location: '', venue: '', seats: '', price: 'Free', priceAmount: '0' }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [registrations, setRegistrations] = useState([])
const [regLoading, setRegLoading] = useState(true)
const [attendeeSearch, setAttendeeSearch] = useState('')

  useEffect(() => {
  if (!user) return navigate('/login')
  if (user.role !== 'admin') return navigate('/dashboard')
  fetchEvents()
  fetchRegistrations()
}, [user])

const fetchRegistrations = async () => {
  try {
    const res = await getAllRegistrations()
    setRegistrations(res.data)
  } catch (err) {
    console.error(err)
  } finally {
    setRegLoading(false)
  }
}

  const fetchEvents = async () => {
    try {
      const res = await getEvents()
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    if (!form.title || !form.date || !form.location || !form.seats || !form.description || !form.venue)
      return alert('Fill all fields!')
    setSaving(true)
    try {
      const payload = { ...form, seats: parseInt(form.seats), priceAmount: parseFloat(form.priceAmount) || 0 }
      if (editId) {
        const res = await updateEvent(editId, payload)
        setEvents(events.map(e => e._id === editId ? res.data : e))
        setEditId(null)
      } else {
        const res = await createEvent(payload)
        setEvents([...events, res.data])
      }
      setForm(emptyForm)
      setShowModal(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event) => {
    setForm({ ...event, seats: String(event.seats), priceAmount: String(event.priceAmount || 0) })
    setEditId(event._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      setEvents(events.filter(e => e._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }
  const totalRegistered = events.reduce((a, e) => a + e.registered, 0)
  const totalSeats = events.reduce((a, e) => a + e.seats, 0)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'Manage Events' },
    { id: 'attendees', label: 'Attendees' },
  ]
const filteredAttendees = registrations.filter(r => {
  const q = attendeeSearch.toLowerCase()
  return r.user?.name?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q) || r.event?.title?.toLowerCase().includes(q)
})
  return (
    <div className="min-h-screen bg-theme flex">

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
        className={`fixed md:sticky top-0 h-screen w-60 bg-surface shadow-theme flex flex-col py-8 px-4 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Link to="/" className="text-xl font-bold text-accent mb-10 px-2 tracking-tight">EventSphere</Link>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${active === item.id ? 'bg-accent text-white' : 'text-secondary hover:bg-surface-2 hover:text-primary'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-2 mb-4">
          <div className="bg-accent-soft rounded-xl p-3 text-center">
            <p className="text-xs text-accent font-semibold">Admin Mode</p>
            <p className="text-xs text-secondary mt-0.5 truncate">{user?.name}</p>
          </div>
        </div>
        <div className="px-2 mb-2 flex items-center justify-center gap-3">
          <ThemeToggle />
          <NotificationBell align="top-right" />
        </div>
        <button onClick={handleLogout}
          className="px-4 py-3 text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-left transition">
          Logout
        </button>
      </motion.div>

      {/* Main */}
      <div className="flex-1 min-w-0">

        {/* Mobile topbar */}
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
            {active === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-8">
                  <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">Admin Dashboard</h1>
                  <p className="text-secondary text-sm mt-1">Quick overview of your events</p>
                </div>

                <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Events', value: events.length, color: 'bg-accent' },
                    { label: 'Registered', value: totalRegistered, color: 'bg-blue-500' },
                    { label: 'Total Seats', value: totalSeats, color: 'bg-purple-500' },
                    { label: 'Fill Rate', value: totalSeats ? `${Math.round((totalRegistered / totalSeats) * 100)}%` : '0%', color: 'bg-green-500' },
                  ].map((s, i) => (
                    <motion.div key={i} variants={fadeUp} className="bg-surface rounded-2xl p-4 md:p-5 shadow-theme flex items-center gap-3">
                      <div className={`${s.color} w-2 h-10 rounded-full flex-shrink-0`}></div>
                      <div>
                        <p className="text-lg md:text-xl font-bold text-primary">{s.value}</p>
                        <p className="text-secondary text-xs">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-surface rounded-2xl shadow-elegant p-6"                 >                   <div className="flex items-center justify-between mb-5">                     <h2 className="font-display text-base font-semibold text-primary">Recent Events</h2>
                    <button onClick={() => setActive('events')} className="text-accent text-sm hover:underline">Manage all →</button>
                  </div>
                  {loading ? (
                    <div className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : events.length === 0 ? (
                    <p className="text-center text-secondary text-sm py-10">No events yet. Create your first event!</p>
                  ) : (
                    <div className="space-y-3">
                      {events.slice(0, 5).map(event => (
                        <div key={event._id} className="flex items-center justify-between gap-3 border border-theme rounded-xl p-4">
                          <div>
                            <h3 className="font-semibold text-primary text-sm">{event.title}</h3>
                            <p className="text-secondary text-xs mt-0.5">{event.date} · {event.location}</p>
                          </div>
                          <span className="bg-accent-soft text-accent text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0">
                            {event.registered}/{event.seats}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {active === 'events' && (
              <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                  <div>
                    <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">Manage Events</h1>
                    <p className="text-secondary text-sm mt-1">Create, edit, and delete events</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                    onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}
                    className="bg-accent text-white px-5 py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition shadow-theme text-sm w-full sm:w-auto"
                  >
                    + Create Event
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                 className="bg-surface rounded-2xl shadow-elegant p-6"                 >                   <h2 className="font-display text-base font-semibold text-primary mb-5">All Events</h2>
                  {loading ? (
                    <div className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : events.length === 0 ? (
                    <p className="text-center text-secondary text-sm py-10">No events yet. Create your first event!</p>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-surface-2 text-secondary text-left text-xs uppercase tracking-wide">
                              <th className="px-4 py-3 rounded-l-xl">Event</th>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Location</th>
                              <th className="px-4 py-3">Registrations</th>
                              <th className="px-4 py-3 rounded-r-xl">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme">
                            <AnimatePresence>
                              {events.map(event => (
                                <motion.tr key={event._id}
                                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                                  className="hover:bg-surface-2 transition"
                                >
                                  <td className="px-4 py-3 font-medium text-primary">{event.title}</td>
                                  <td className="px-4 py-3">
                                    <span className="bg-accent-soft text-accent text-xs px-2 py-1 rounded-lg font-medium">{event.category}</span>
                                  </td>
                                  <td className="px-4 py-3 text-secondary">{event.date}</td>
                                  <td className="px-4 py-3 text-secondary">{event.location}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-surface-2 rounded-full h-1.5">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(event.registered / event.seats) * 100}%` }}
                                          transition={{ duration: 0.8, ease: 'easeOut' }}
                                          className="bg-accent h-1.5 rounded-full"
                                        />
                                      </div>
                                      <span className="text-secondary text-xs">{event.registered}/{event.seats}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                      <button onClick={() => handleEdit(event)}
                                        className="text-accent hover:bg-accent-soft px-3 py-1 rounded-lg text-xs font-medium transition">Edit</button>
                                      <button onClick={() => handleDelete(event._id)}
                                        className="text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1 rounded-lg text-xs font-medium transition">Delete</button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>

                      <div className="md:hidden space-y-4">
                        <AnimatePresence>
                          {events.map(event => (
                            <motion.div key={event._id}
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="border border-theme rounded-xl p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-primary text-sm">{event.title}</h3>
                                <span className="bg-accent-soft text-accent text-xs px-2 py-1 rounded-lg font-medium ml-2 flex-shrink-0">{event.category}</span>
                              </div>
                              <p className="text-secondary text-xs mb-1">{event.date} · {event.location}</p>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex-1 bg-surface-2 rounded-full h-1.5">
                                  <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(event.registered / event.seats) * 100}%` }}></div>
                                </div>
                                <span className="text-secondary text-xs">{event.registered}/{event.seats}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(event)}
                                  className="flex-1 text-accent border border-accent/30 py-1.5 rounded-lg text-xs font-medium hover:bg-accent-soft transition">Edit</button>
                                <button onClick={() => handleDelete(event._id)}
                                  className="flex-1 text-red-400 border border-red-200 dark:border-red-900 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition">Delete</button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            {active === 'attendees' && (
              <motion.div key="attendees" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="font-display text-xl md:text-2xl font-semibold text-primary">Attendees</h1>
                    <p className="text-secondary text-sm mt-1">{registrations.length} total registration{registrations.length !== 1 ? 's' : ''} across all events</p>
                  </div>
                  <input
                    type="text"
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    placeholder="Search name, email, or event..."
                    className="border border-theme rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary w-full sm:w-72"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-surface rounded-2xl shadow-theme p-6"
                >
                  {regLoading ? (
                    <div className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : filteredAttendees.length === 0 ? (
                    <p className="text-center text-secondary text-sm py-10">
                      {registrations.length === 0 ? 'No registrations yet.' : 'No attendees match your search.'}
                    </p>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-surface-2 text-secondary text-left text-xs uppercase tracking-wide">
                              <th className="px-4 py-3 rounded-l-xl">Attendee</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Event</th>
                              <th className="px-4 py-3">Registered On</th>
                              <th className="px-4 py-3 rounded-r-xl">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme">
                            <AnimatePresence>
                              {filteredAttendees.map(reg => (
                                <motion.tr key={reg._id}
                                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                                  className="hover:bg-surface-2 transition"
                                >
                                  <td className="px-4 py-3 font-medium text-primary">{reg.user?.name || '—'}</td>
                                  <td className="px-4 py-3 text-secondary">{reg.user?.email || '—'}</td>
                                  <td className="px-4 py-3 text-secondary">{reg.event?.title || '—'}</td>
                                  <td className="px-4 py-3 text-secondary">{new Date(reg.createdAt).toLocaleDateString()}</td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ${reg.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-surface-2 text-secondary'}`}>
                                      {reg.status}
                                    </span>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-4">
                        <AnimatePresence>
                          {filteredAttendees.map(reg => (
                            <motion.div key={reg._id}
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="border border-theme rounded-xl p-4"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-primary text-sm">{reg.user?.name || '—'}</h3>
                                <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ml-2 flex-shrink-0 ${reg.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-surface-2 text-secondary'}`}>
                                  {reg.status}
                                </span>
                              </div>
                              <p className="text-secondary text-xs mb-1">{reg.user?.email}</p>
                              <p className="text-secondary text-xs">{reg.event?.title} · {new Date(reg.createdAt).toLocaleDateString()}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-surface rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-display text-lg font-semibold text-primary mb-6">{editId ? 'Edit Event' : 'Create New Event'}</h2>
              <div className="space-y-4">
                {[
                  { label: 'Event Title', name: 'title', type: 'text', placeholder: 'e.g. Tech Summit 2025' },
                  { label: 'Description', name: 'description', type: 'text', placeholder: 'Brief description' },
                  { label: 'Date', name: 'date', type: 'text', placeholder: 'e.g. Jun 15, 2025' },
                  { label: 'Time', name: 'time', type: 'text', placeholder: 'e.g. 10:00 AM' },
                  { label: 'Location', name: 'location', type: 'text', placeholder: 'e.g. Kolkata' },
                  { label: 'Venue', name: 'venue', type: 'text', placeholder: 'e.g. Science City Auditorium' },
                  { label: 'Total Seats', name: 'seats', type: 'number', placeholder: 'e.g. 100' },
                  { label: 'Price', name: 'price', type: 'text', placeholder: 'e.g. Free or ₹499' },
                  { label: 'Price Amount (₹, use 0 for Free)', name: 'priceAmount', type: 'number', placeholder: 'e.g. 499 or 0' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full border border-theme rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-theme rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-theme text-primary">
                    {['Technology', 'Entertainment', 'Business', 'Cultural'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                  className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition text-sm flex items-center justify-center">
                  {saving ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : editId ? 'Update Event' : 'Create Event'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowModal(false)}
                  className="flex-1 border border-theme text-secondary py-3 rounded-xl font-semibold hover:bg-surface-2 transition text-sm">
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}