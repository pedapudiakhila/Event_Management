import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
function TabSessionMarker() {
  const location = useLocation()
  useEffect(() => {
    const isResetFlow = location.pathname.startsWith('/reset-password')
    if (!isResetFlow) {
      sessionStorage.setItem('eventsphere-tab-active', 'true')
    }
  }, [location.pathname])
  return null
}
function App() {
  return (
    <BrowserRouter>
    <TabSessionMarker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App