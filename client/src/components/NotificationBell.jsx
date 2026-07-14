import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../api'

export default function NotificationBell({ align = 'bottom-right' }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const wrapperRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications()
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleBellClick = () => setOpen((v) => !v)

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification._id)
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)))
      } catch (err) {
        console.error(err)
      }
    }
    setOpen(false)
    if (notification.link) navigate(notification.link)
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return mins + 'm ago'
    const hours = Math.floor(mins / 60)
    if (hours < 24) return hours + 'h ago'
    const days = Math.floor(hours / 24)
    return days + 'd ago'
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleBellClick}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 transition text-secondary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={
              'absolute w-80 max-h-96 overflow-y-auto bg-surface border border-theme rounded-2xl shadow-elegant z-50 ' +
              (align === 'top-right'
                ? 'bottom-full mb-2 left-0'
                : 'top-full mt-2 right-0')
            }
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-theme sticky top-0 bg-surface">
              <h3 className="font-display text-sm font-semibold text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-accent hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-center text-secondary text-sm py-10">No notifications yet.</p>
            ) : (
              <div className="divide-y divide-theme">
                {notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={
                      n.read
                        ? 'w-full text-left px-4 py-3 hover:bg-surface-2 transition'
                        : 'w-full text-left px-4 py-3 hover:bg-surface-2 transition bg-accent-soft'
                    }
                  >
                    <p className="text-sm text-primary">{n.message}</p>
                    <p className="text-xs text-muted mt-1">{formatTime(n.createdAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}