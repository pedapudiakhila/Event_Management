const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')
const { sendPasswordResetEmail } = require('../utils/sendEmail')
const { notifyAdmins } = require('../utils/notify')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const generateToken = (user, expiresIn) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn || '7d' }
  )
}
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role })
    const token = generateToken(user)

    notifyAdmins(`${user.name} just signed up`, 'new_signup', '/admin')

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = generateToken(user, rememberMe ? '30d' : '1d')
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    console.log('[forgotPassword] Looking up:', email)
    const user = await User.findOne({ email })
    console.log('[forgotPassword] User found:', !!user)

    if (!user) {
      console.log('[forgotPassword] No matching user — returning early, no email sent')
      return res.json({ message: 'If that email is registered, a reset link has been sent.' })
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000
    await user.save()

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`

    console.log('[forgotPassword] Attempting to send email to:', user.email)
    await sendPasswordResetEmail(user.email, resetUrl)
    console.log('[forgotPassword] Email sent successfully')

    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    res.json({ message: 'Password reset successful. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name) user.name = name.trim()

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required to set a new one' })
      const match = await bcrypt.compare(currentPassword, user.password)
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' })
      if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' })
      user.password = await bcrypt.hash(newPassword, 10)
    }

    await user.save()
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name } = payload

    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId
        await user.save()
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        password: undefined,
        role: 'user'
      })
    }

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: 'Google authentication failed' })
  }
}

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword, googleAuth }