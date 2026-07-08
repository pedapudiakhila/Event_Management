import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { forgotPassword } from '../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Please enter your email.')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface rounded-2xl shadow-elegant p-8"
      >
        <Link to="/" className="text-xl font-bold text-accent block mb-8">EventSphere</Link>

        {sent ? (
          <>
            <h2 className="font-display text-2xl font-semibold text-primary mb-1">Check your inbox</h2>
            <p className="text-secondary text-sm mb-6">
              If an account exists for <span className="font-medium text-primary">{email}</span>, we've sent a link to reset your password. It expires in 1 hour.
            </p>
            <Link to="/login" className="text-accent font-medium hover:underline text-sm">← Back to login</Link>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-semibold text-primary mb-1">Forgot password?</h2>
            <p className="text-secondary text-sm mb-8">No worries, we'll send you a reset link.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full border border-theme rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-surface-2 text-primary disabled:opacity-60"
                />
                {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition shadow-elegant flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : 'Send reset link'}
              </motion.button>
            </div>

            <p className="text-center text-sm text-secondary mt-8">
              Remembered your password?{' '}
              <Link to="/login" className="text-accent font-medium hover:underline">Login</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}