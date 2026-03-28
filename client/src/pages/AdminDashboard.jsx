import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api'
import { useAuth } from '../context/AuthContext'

const emptyForm = { title: '', description: '', category: 'Technology', date: '', time: '10:00 AM', location: '', venue: '', seats: '', price: 'Free' }
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

  useEffect(() => {
    if (!user) return navigate('/login')
    if (user.role !== 'admin') return navigate('/dashboard')
    fetchEvents()
  }, [user])

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
      if (editId) {
        const res = await updateEvent(editId, { ...form, seats: parseInt(form.seats) })
        setEvents(events.map(e => e._id === editId ? res.data : e))
        setEditId(null)
      } else {
        const res = await createEvent({ ...form, seats: parseInt(form.seats) })
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
    setForm({ ...event, seats: String(event.seats) })
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
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${active === item.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-2 mb-4">
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <p className="text-xs text-indigo-600 font-semibold">Admin Mode</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.name}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="px-4 py-3 text-sm text-red-400 hover:bg-red-50 rounded-xl text-left transition">
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
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Manage all your events from here</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
              onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}
              className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm text-sm w-full sm:w-auto"
            >
              + Create Event
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Events', value: events.length, color: 'bg-indigo-600' },
              { label: 'Registered', value: totalRegistered, color: 'bg-blue-500' },
              { label: 'Total Seats', value: totalSeats, color: 'bg-purple-500' },
              { label: 'Fill Rate', value: totalSeats ? `${Math.round((totalRegistered / totalSeats) * 100)}%` : '0%', color: 'bg-green-500' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex items-center gap-3">
                <div className={`${s.color} w-2 h-10 rounded-full flex-shrink-0`}></div>
                <div>
                  <p className="text-lg md:text-xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Events Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-base font-bold text-gray-800 mb-5">All Events</h2>
            {loading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No events yet. Create your first event!</p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-left text-xs uppercase tracking-wide">
                        <th className="px-4 py-3 rounded-l-xl">Event</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Registrations</th>
                        <th className="px-4 py-3 rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <AnimatePresence>
                        {events.map(event => (
                          <motion.tr key={event._id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">{event.title}</td>
                            <td className="px-4 py-3">
                              <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-lg font-medium">{event.category}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-400">{event.date}</td>
                            <td className="px-4 py-3 text-gray-400">{event.location}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-100 rounded-full h-1.5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(event.registered / event.seats) * 100}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                  />
                                </div>
                                <span className="text-gray-400 text-xs">{event.registered}/{event.seats}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(event)}
                                  className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg text-xs font-medium transition">Edit</button>
                                <button onClick={() => handleDelete(event._id)}
                                  className="text-red-400 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-medium transition">Delete</button>
                              </div>
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
                    {events.map(event => (
                      <motion.div key={event._id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border border-gray-100 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm">{event.title}</h3>
                          <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-lg font-medium ml-2 flex-shrink-0">{event.category}</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">{event.date} · {event.location}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(event.registered / event.seats) * 100}%` }}></div>
                          </div>
                          <span className="text-gray-400 text-xs">{event.registered}/{event.seats}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(event)}
                            className="flex-1 text-indigo-600 border border-indigo-200 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-50 transition">Edit</button>
                          <button onClick={() => handleDelete(event._id)}
                            className="flex-1 text-red-400 border border-red-100 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition">Delete</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
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
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-6">{editId ? 'Edit Event' : 'Create New Event'}</h2>
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
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50">
                    {['Technology', 'Entertainment', 'Business', 'Cultural'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm flex items-center justify-center">
                  {saving ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : editId ? 'Update Event' : 'Create Event'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
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