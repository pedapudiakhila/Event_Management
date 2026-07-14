import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getEvent, registerForEvent, createPaymentOrder, verifyPayment } from '../api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

const shareLinks = [
  { name: 'WhatsApp', color: 'bg-green-500' },
  { name: 'Twitter / X', color: 'bg-gray-900' },
  { name: 'Facebook', color: 'bg-blue-600' },
]

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

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
    if (event.priceAmount && event.priceAmount > 0) {
      return handlePaidRegister()
    }
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

  const handlePaidRegister = async () => {
    setRegistering(true)
    try {
      const orderRes = await createPaymentOrder(id)
      const orderId = orderRes.data.orderId
      const amount = orderRes.data.amount
      const currency = orderRes.data.currency
      const keyId = orderRes.data.keyId

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'EventSphere',
        description: event.title,
        order_id: orderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              eventId: id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            alert('Payment successful! You are registered.')
            navigate('/dashboard')
          } catch (err) {
            alert(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Payment verification failed')
          } finally {
            setRegistering(false)
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#4f38e0'
        },
        modal: {
          ondismiss: function () {
            setRegistering(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Could not start payment')
      setRegistering(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = event ? 'Check out "' + event.title + '" on EventSphere!' : 'Check out this event on EventSphere!'

  const getShareHref = (name) => {
    if (name === 'WhatsApp') return 'https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + shareUrl)
    if (name === 'Twitter / X') return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(shareUrl)
    if (name === 'Facebook') return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl)
    return '#'
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const closeShareMenu = () => setShowShareMenu(false)
  const toggleShareMenu = () => setShowShareMenu(!showShareMenu)

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-soft border-t-accent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-primary">Event not found</p>
          <Link to="/events" className="text-accent mt-4 inline-block hover:underline">← Back to Events</Link>
        </div>
      </div>
    )
  }

  const seatsLeft = event.seats - event.registered
  const percent = Math.round((event.registered / event.seats) * 100)

  const colorMap = {
    Technology: 'from-indigo-500 to-blue-500',
    Entertainment: 'from-purple-500 to-pink-500',
    Business: 'from-pink-500 to-rose-500',
    Cultural: 'from-yellow-500 to-orange-500',
  }
  const heroGradient = colorMap[event.category] || 'from-indigo-500 to-purple-500'

  return (
    <div className="min-h-screen bg-theme">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={'bg-gradient-to-br ' + heroGradient + ' text-white py-20 px-10'}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/events" className="text-white/70 text-sm hover:text-white mb-6 inline-block transition">← Back to Events</Link>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block ml-4">{event.category}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl font-semibold mt-3 mb-5"
          >
            {event.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 text-white/80 text-sm"
          >
            <span>{event.date} at {event.time}</span>
            <span>{event.venue}, {event.location}</span>
            <span>{event.price}</span>
            <span>By {event.organizer && event.organizer.name ? event.organizer.name : 'Organizer'}</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={stagger} initial="hidden" animate="show" className="md:col-span-2 space-y-6">
          <motion.div variants={fadeUp} className="bg-surface rounded-2xl p-6 shadow-elegant">
            <h2 className="font-display text-lg font-semibold text-primary mb-3">About this Event</h2>
            <p className="text-secondary leading-relaxed text-sm">{event.description}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-surface rounded-2xl p-6 shadow-elegant">
            <h2 className="font-display text-lg font-semibold text-primary mb-4">Event Highlights</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Networking Opportunities', 'Expert Speakers', 'Certificates Provided', 'Free Refreshments'].map((h, i) => {
                return (
                  <div key={i} className="flex items-center gap-2 text-secondary text-sm">
                    <span className="w-2 h-2 bg-accent rounded-full inline-block"></span> {h}
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-surface rounded-2xl p-6 shadow-elegant">
            <h2 className="font-display text-lg font-semibold text-primary mb-3">Location</h2>
            <div className="bg-surface-2 rounded-xl p-4 text-sm text-secondary">
              <p className="font-semibold text-primary">{event.venue}</p>
              <p>{event.location}, India</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="bg-surface rounded-2xl p-6 shadow-elegant sticky top-24 relative">
            <div className="text-center mb-5">
              <p className="font-display text-3xl font-semibold text-accent">{event.price}</p>
              <p className="text-muted text-xs mt-1">per person</p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>{event.registered} registered</span>
                <span>{seatsLeft} left</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: percent + '%' }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
                  className="bg-accent h-1.5 rounded-full"
                />
              </div>
              <p className="text-xs text-muted mt-1">{percent}% filled</p>
            </div>

            {seatsLeft > 0 ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition shadow-elegant flex items-center justify-center"
              >
                {registering ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : 'Register Now'}
              </motion.button>
            ) : (
              <button disabled className="w-full bg-surface-2 text-muted py-3 rounded-xl font-semibold cursor-not-allowed">
                Sold Out
              </button>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={toggleShareMenu}
              className="w-full mt-3 border border-theme text-secondary py-3 rounded-xl font-semibold hover:bg-surface-2 transition text-sm"
            >
              Share Event
            </motion.button>

            <AnimatePresence>
              {showShareMenu ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-6 right-6 mt-2 bg-surface border border-theme rounded-xl shadow-elegant p-3 z-10"
                  style={{ top: '100%' }}
                >
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {shareLinks.map(function (s) {
                      const linkClass = s.color + ' text-white text-xs font-medium rounded-lg py-2 text-center hover:opacity-90 transition'
                      return React.createElement(
                        'a',
                        {
                          key: s.name,
                          href: getShareHref(s.name),
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          onClick: closeShareMenu,
                          className: linkClass,
                        },
                        s.name
                      )
                    })}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full border border-theme text-secondary text-xs font-medium rounded-lg py-2 hover:bg-surface-2 transition"
                  >
                    {linkCopied ? 'Link copied!' : 'Copy link'}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <p className="text-center text-xs text-muted mt-4">Secure registration · Free cancellation</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}