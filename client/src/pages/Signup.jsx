import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.name || !form.email || !form.password) return alert('Fill all fields!')
  if (form.password !== form.confirm) return alert('Passwords do not match!')
  setLoading(true)
  try {
    const user = await register({ name: form.name, email: form.email, password: form.password, role: form.role })
    if (user.role === 'admin') navigate('/admin')
    else navigate('/dashboard')
  } catch (err) {
    alert(err.response?.data?.message || 'Signup failed')
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
        <h2 className="text-4xl font-extrabold leading-tight mb-4">Join the<br />Community.</h2>
        <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
          Create your account and start discovering, registering, and managing events today.
        </p>
        <div className="mt-16 grid grid-cols-2 gap-4">
          {[
            { num: '500+', label: 'Events' },
            { num: '10K+', label: 'Attendees' },
            { num: '50+', label: 'Cities' },
            { num: '100%', label: 'Free to Join' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-center"
            >
              <p className="text-2xl font-bold">{s.num}</p>
              <p className="text-indigo-200 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-8 py-10"
      >
        <div className="w-full max-w-md">
          <Link to="/" className="text-xl font-bold text-indigo-600 md:hidden block mb-8">EventSphere</Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h2>
          <p className="text-gray-400 text-sm mb-8">Join thousands of event lovers</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50" />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'user', label: 'Attendee' }, { val: 'admin', label: 'Organizer' }].map(r => (
                  <motion.button
                    key={r.val} whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, role: r.val })}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${
                      form.role === r.val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 text-gray-600 hover:border-indigo-300 bg-gray-50'
                    }`}
                  >
                    {r.label}
                  </motion.button>
                ))}
              </div>
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
              ) : 'Create Account'}
            </motion.button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}