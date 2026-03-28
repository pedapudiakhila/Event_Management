import axios from 'axios'

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
})

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

export const getEvents = (params) => API.get('/events', { params })
export const getEvent = (id) => API.get(`/events/${id}`)
export const createEvent = (data) => API.post('/events', data)
export const updateEvent = (id, data) => API.put(`/events/${id}`, data)
export const deleteEvent = (id) => API.delete(`/events/${id}`)

export const registerForEvent = (eventId) => API.post(`/registrations/${eventId}`)
export const getMyRegistrations = () => API.get('/registrations/my')
export const cancelRegistration = (id) => API.delete(`/registrations/${id}`)

export default API