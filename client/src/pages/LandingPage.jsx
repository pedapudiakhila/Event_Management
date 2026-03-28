import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getEvents } from '../api'
import Navbar from '../components/Navbar'

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }

export default function LandingPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents().then(res => setEvents(res.data.slice(0, 3))).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white py-32 px-10 text-center overflow-hidden">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl mx-auto">
          <motion.span variants={fadeUp} className="inline-block bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6 tracking-wide">
            The Modern Event Platform
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-5xl font-extrabold mb-5 leading-tight">
            Discover & Manage<br />Events Effortlessly
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-10 text-indigo-100 max-w-xl mx-auto">
            Create, register, and experience events like never before — all in one place.
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center gap-4">
            <Link to="/events" className="bg-white text-indigo-600 font-semibold px-7 py-3 rounded-lg hover:bg-indigo-50 transition shadow-md">Browse Events</Link>
            <Link to="/signup" className="border border-white/60 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/10 transition">Get Started</Link>
          </motion.div>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-16 flex justify-center gap-4 flex-wrap"
        >
          {events.slice(0, 3).map((e, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
              {e.title} — {e.location}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-10 bg-gray-50">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h3 variants={fadeUp} className="text-3xl font-bold text-center text-gray-800 mb-14">
            Why EventSphere?
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Easy Registration', desc: 'Register for events in one click with instant confirmation.', icon: '01' },
              { title: 'Admin Dashboard', desc: 'Manage events, attendees and analytics from one place.', icon: '02' },
              { title: 'Real-time Updates', desc: 'Get notified about event changes and new opportunities.', icon: '03' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition group">
                <span className="text-indigo-200 font-bold text-4xl group-hover:text-indigo-400 transition">{f.icon}</span>
                <h4 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{f.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Upcoming Events — Real Data */}
      <section className="py-24 px-10">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h3 variants={fadeUp} className="text-3xl font-bold text-center text-gray-800 mb-14">
            Upcoming Events
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <motion.p variants={fadeUp} className="col-span-3 text-center text-gray-400 text-sm">
                No upcoming events yet.
              </motion.p>
            ) : (
              events.map((e, i) => (
                <motion.div key={e._id} variants={fadeUp}
                  whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 cursor-pointer"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-3">{e.title}</h4>
                  <p className="text-gray-500 text-sm mb-1">{e.date}</p>
                  <p className="text-gray.500 text-sm mb-1">{e.location}</p>
                  <p className="text-gray-500 text-sm mb-4">{e.seats - e.registered} seats left</p>
                  <Link to={`/events/${e._id}`} className="text-indigo-600 text-sm font-semibold hover:underline">View Event →</Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 text-white py-20 px-10">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center"
        >
          {[
            { num: '500+', label: 'Events Hosted' },
            { num: '10K+', label: 'Happy Attendees' },
            { num: '50+', label: 'Cities Covered' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}>
              <p className="text-5xl font-extrabold">{s.num}</p>
              <p className="text-indigo-200 mt-2 text-sm tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
  <p className="text-sm font-semibold text-white mb-1">EventSphere</p>
  <p className="text-xs">© 2025 All rights reserved.</p>
</footer>

    </div>
  )
}