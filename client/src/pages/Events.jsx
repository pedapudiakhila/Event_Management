import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../api'
import Navbar from '../components/Navbar'

const categories = ['All', 'Technology', 'Entertainment', 'Business', 'Cultural']

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

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
    <div className="min-h-screen bg-theme">

      {/* Navbar */}
      <Navbar active="events" />

      {/* Header */}
      <div className="gradient-hero text-white py-16 px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-4xl font-semibold mb-2">Explore Events</h2>
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
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-theme rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-surface text-primary shadow-theme"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={
                  category === cat
                    ? 'px-4 py-2 rounded-xl text-sm font-medium transition bg-accent text-white shadow-elegant'
                    : 'px-4 py-2 rounded-xl text-sm font-medium transition bg-surface border border-theme text-secondary hover:border-indigo-300'
                }
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-accent-soft border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="text-secondary text-sm mt-4">Loading events...</p>
          </div>
        ) : (
          <>
            <p className="text-secondary text-sm mb-6">{events.length} events found</p>
            <motion.div
              variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event) => {
                const badgeClass = (badgeMap[event.category] || 'bg-gray-500') + ' text-white text-xs px-3 py-1 rounded-full font-medium'
                const seatsLeft = event.seats - event.registered
                const fillPercent = (event.registered / event.seats) * 100

                return (
                  <motion.div
                    key={event._id} variants={fadeUp}
                    whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-surface border border-theme rounded-2xl p-6 shadow-elegant"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={badgeClass}>{event.category}</span>
                      <span className="text-xs text-muted">{event.date}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary mb-2">{event.title}</h3>
                    <p className="text-secondary text-sm mb-1">{event.location}</p>
                    <p className="text-secondary text-sm mb-4">{seatsLeft} seats left</p>

                    <div className="w-full bg-surface-2 rounded-full h-1.5 mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: fillPercent + '%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-accent h-1.5 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted mb-4">{event.registered}/{event.seats} registered</p>

                    <Link
                      to={'/events/' + event._id}
                      className="block text-center bg-accent-soft text-accent font-semibold py-2 rounded-xl hover:bg-accent hover:text-white transition border border-theme text-sm"
                    >
                      View Details →
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {events.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                <p className="text-xl font-semibold text-primary">No events found</p>
                <p className="text-sm text-secondary mt-1">Try a different search or category</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}