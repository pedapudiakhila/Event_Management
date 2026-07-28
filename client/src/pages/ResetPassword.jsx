import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetPassword } from '../api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // 1. Check if user already has a saved theme preference in this profile/browser
    const savedTheme = localStorage.getItem('eventsphere-theme')
    
    // 2. If savedTheme exists ('dark' or 'light'), keep it.
    //    If no saved theme exists, default strictly to 'light'.
    const themeToApply = (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
    
    document.documentElement.setAttribute('data-theme', themeToApply)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or has expired.')
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

        {success ? (
          <>
            <h2 className="font-display text-2xl font-semibold text-primary mb-1">Password reset!</h2>
            <p className="text-secondary text-sm">Redirecting you to login...</p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-semibold text-primary mb-1">Set a new password</h2>
            <p className="text-secondary text-sm mb-8">Choose something you haven't used before.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full border border-theme rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-surface-2 text-primary disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-xs font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Confirm new password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                ) : 'Reset password'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}