import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../api'
import Navbar from '../components/Navbar'

const categories = ['All', 'Technology', 'Entertainment', 'Business', 'Cultural']

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const colorMap = {
  Technology: 'bg-indigo-50 border-indigo-100',
  Entertainment: 'bg-purple-50 border-purple-100',
  Business: 'bg-pink-50 border-pink-100',
  Cultural: 'bg-yellow-50 border-yellow-100',
}
const badgeMap = {
  Technology: 'bg-indigo-600',
  Entertainment: 'bg-purple-600',
  Business: 'bg-pink-600',
  Cultural: 'bg-yellow-500',
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [category, search])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = {}
      if (category !== 'All') params.category = category
      if (search) params.search = search
      const res = await getEvents(params)
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar active="events" />

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white py-16 px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl font-extrabold mb-2">Explore Events</h2>
          <p className="text-indigo-100 text-sm">Find and register for events that excite you</p>
        </motion.div>
      </div>

      {/* Search + Filter */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <motion.button
                key={cat} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm mt-4">Loading events...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">{events.length} events found</p>
            <motion.div
              variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map(event => (
                <motion.div
                  key={event._id} variants={fadeUp}
                  whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
                  className={`${colorMap[event.category] || 'bg-gray-50 border-gray-100'} border rounded-2xl p-6`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${badgeMap[event.category] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full font-medium`}>{event.category}</span>
                    <span className="text-xs text-gray-400">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{event.location}</p>
                  <p className="text-gray-500 text-sm mb-4">{event.seats - event.registered} seats left</p>

                  <div className="w-full bg-white rounded-full h-1.5 mb-1">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(event.registered / event.seats) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="bg-indigo-500 h-1.5 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{event.registered}/{event.seats} registered</p>

                  <Link
                    to={`/events/${event._id}`}
                    className="block text-center bg-white text-indigo-600 font-semibold py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition border border-indigo-100 text-sm"
                  >
                    View Details →
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {events.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-gray-300">
                <p className="text-xl font-semibold text-gray-400">No events found</p>
                <p className="text-sm text-gray-300 mt-1">Try a different search or category</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}