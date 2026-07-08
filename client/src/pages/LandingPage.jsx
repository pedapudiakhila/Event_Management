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
    <div className="min-h-screen bg-theme">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative text-white py-32 px-10 text-center overflow-hidden">

        {/* Floating decorative blobs */}
        <div className="blob blob-1 w-72 h-72 bg-white -top-10 -left-10"></div>
        <div className="blob blob-2 w-96 h-96 bg-white top-1/3 right-0"></div>
        <div className="blob blob-3 w-64 h-64 bg-white bottom-0 left-1/4"></div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl mx-auto relative z-10">
          <motion.span variants={fadeUp} className="inline-block bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6 tracking-wide">
            The Modern Event Platform
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display text-5xl font-semibold mb-5 leading-tight">
            Discover & Manage<br />Events Effortlessly
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg mb-10 text-indigo-100 max-w-xl mx-auto">
            Create, register, and experience events like never before — all in one place.
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center gap-4">
            <Link to="/events" className="bg-white text-indigo-600 font-semibold px-7 py-3 rounded-lg hover:bg-indigo-50 transition shadow-elegant btn-glow">Browse Events</Link>
            <Link to="/signup" className="border border-white/60 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/10 transition">Get Started</Link>
          </motion.div>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-16 flex justify-center gap-4 flex-wrap relative z-10"
        >
          {events.slice(0, 3).map((e, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
              {e.title} — {e.location}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gradient-soft py-24 px-10">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h3 variants={fadeUp} className="font-display text-3xl font-semibold text-center text-primary mb-14">
            Why EventSphere?
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Easy Registration', desc: 'Register for events in one click with instant confirmation.', icon: '01' },
              { title: 'Admin Dashboard', desc: 'Manage events, attendees and analytics from one place.', icon: '02' },
              { title: 'Real-time Updates', desc: 'Get notified about event changes and new opportunities.', icon: '03' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-surface rounded-2xl p-8 shadow-elegant hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-accent-soft font-bold text-4xl group-hover:text-accent transition">{f.icon}</span>
                <h4 className="font-display text-xl font-semibold text-primary mt-4 mb-2">{f.title}</h4>
                <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
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
          <motion.h3 variants={fadeUp} className="font-display text-3xl font-semibold text-center text-primary mb-14">
            Upcoming Events
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <motion.p variants={fadeUp} className="col-span-3 text-center text-secondary text-sm">
                No upcoming events yet.
              </motion.p>
            ) : (
              events.map((e, i) => (
                <motion.div key={e._id} variants={fadeUp}
                  whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-accent-soft border border-theme rounded-2xl p-6 cursor-pointer shadow-elegant"
                >
                  <h4 className="font-display text-lg font-semibold text-primary mb-3">{e.title}</h4>
                  <p className="text-secondary text-sm mb-1">{e.date}</p>
                  <p className="text-secondary text-sm mb-1">{e.location}</p>
                  <p className="text-secondary text-sm mb-4">{e.seats - e.registered} seats left</p>
                  <Link to={`/events/${e._id}`} className="text-accent text-sm font-semibold hover:underline">View Event →</Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-accent text-white py-20 px-10">
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
              <p className="font-display text-5xl font-semibold">{s.num}</p>
              <p className="text-indigo-200 mt-2 text-sm tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 text-center py-8">
        <p className="font-display text-sm font-semibold text-white mb-1">EventSphere</p>
        <p className="text-xs">© 2025 All rights reserved.</p>
      </footer>

    </div>
  )
}