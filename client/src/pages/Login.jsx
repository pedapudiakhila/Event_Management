import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { getEvents } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const [events, setEvents] = useState([])

useEffect(() => {
  getEvents().then(res => setEvents(res.data.slice(0, 3))).catch(console.error)
}, [])
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.email || !form.password) return alert('Fill all fields!')
  setLoading(true)
  try {
    const user = await login(form)
    if (user.role === 'admin') navigate('/admin')
    else navigate('/dashboard')
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex">

      {/* Left Panel */}
      <motion.div
        initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-1/2"
      >
        <Link to="/" className="text-2xl font-bold mb-16 tracking-tight">EventSphere</Link>
        <h2 className="text-4xl font-extrabold leading-tight mb-4">Welcome<br />Back.</h2>
        <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
          Log in to access your dashboard, manage registrations, and discover new events.
        </p>
        <div className="mt-16 space-y-4">
          {events.length === 0 ? (
  <p className="text-indigo-200 text-sm">No upcoming events yet.</p>
) : (
  events.map((e, i) => (
    <motion.div
      key={e._id}
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm"
    >
      {e.title} — {e.date}
    </motion.div>
  ))
)}
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-8"
      >
        <div className="w-full max-w-md">
          <Link to="/" className="text-xl font-bold text-indigo-600 md:hidden block mb-8">EventSphere</Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Login to your account</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="accent-indigo-600" /> Remember me
              </label>
              <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : 'Login'}
            </motion.button>

            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <div className="flex-1 h-px bg-gray-200"></div>or continue as<div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}