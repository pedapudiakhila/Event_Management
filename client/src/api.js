import axios from 'axios'

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const googleAuth = (credential) => API.post('/auth/google', { credential })
export const getMe = () => API.get('/auth/me')
export const updateProfile = (data) => API.put('/auth/profile', data)
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email })
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password })

export const getEvents = (params) => API.get('/events', { params })
export const getEvent = (id) => API.get(`/events/${id}`)
export const createEvent = (data) => API.post('/events', data)
export const updateEvent = (id, data) => API.put(`/events/${id}`, data)
export const deleteEvent = (id) => API.delete(`/events/${id}`)

export const registerForEvent = (eventId) => API.post(`/registrations/${eventId}`)
export const createPaymentOrder = (eventId) => API.post('/payments/create-order', { eventId })
export const verifyPayment = (data) => API.post('/payments/verify', data)
export const getMyRegistrations = () => API.get('/registrations/my')
export const cancelRegistration = (id) => API.delete(`/registrations/${id}`)
export const getAllRegistrations = () => API.get('/registrations/all')

export const getMyNotifications = () => API.get('/notifications/my')
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => API.put('/notifications/read-all')

export default API