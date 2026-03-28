import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvent, registerForEvent } from '../api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const res = await getEvent(id)
      setEvent(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user) return navigate('/login')
    setRegistering(true)
    try {
      await registerForEvent(id)
      alert('Registered successfully!')
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-700">Event not found</p>
        <Link to="/events" className="text-indigo-600 mt-4 inline-block hover:underline">← Back to Events</Link>
      </div>
    </div>
  )

  const seatsLeft = event.seats - event.registered
  const percent = Math.round((event.registered / event.seats) * 100)

  const colorMap = {
    Technology: 'from-indigo-500 to-blue-500',
    Entertainment: 'from-purple-500 to-pink-500',
    Business: 'from-pink-500 to-rose-500',
    Cultural: 'from-yellow-500 to-orange-500',
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className={`bg-gradient-to-br ${colorMap[event.category] || 'from-indigo-500 to-purple-500'} text-white py-20 px-10`}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/events" className="text-white/70 text-sm hover:text-white mb-6 inline-block transition">← Back to Events</Link>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block ml-4">{event.category}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold mt-3 mb-5"
          >
            {event.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 text-white/80 text-sm"
          >
            <span>{event.date} at {event.time}</span>
            <span>{event.venue}, {event.location}</span>
            <span>{event.price}</span>
            <span>By {event.organizer?.name || 'Organizer'}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="md:col-span-2 space-y-6">
          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">About this Event</h2>
            <p className="text-gray-500 leading-relaxed text-sm">{event.description}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Event Highlights</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Networking Opportunities', 'Expert Speakers', 'Certificates Provided', 'Free Refreshments'].map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full inline-block"></span> {h}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Location</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
              <p className="font-semibold text-gray-800">{event.venue}</p>
              <p>{event.location}, India</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="text-center mb-5">
              <p className="text-3xl font-extrabold text-indigo-600">{event.price}</p>
              <p className="text-gray-400 text-xs mt-1">per person</p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{event.registered} registered</span>
                <span>{seatsLeft} left</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
                  className="bg-indigo-500 h-1.5 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">{percent}% filled</p>
            </div>

            {seatsLeft > 0 ? (
              <motion.button
                whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
              >
                {registering ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : 'Register Now'}
              </motion.button>
            ) : (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-semibold cursor-not-allowed">
                Sold Out
              </button>
            )}

            <motion.button whileTap={{ scale: 0.97 }}
              className="w-full mt-3 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
              Share Event
            </motion.button>

            <p className="text-center text-xs text-gray-300 mt-4">Secure registration · Free cancellation</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}