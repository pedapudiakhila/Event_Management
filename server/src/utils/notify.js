const Notification = require('../models/Notification')
const User = require('../models/User')

const notifyUser = async (userId, message, type, link) => {
  try {
    await Notification.create({ user: userId, message, type, link: link || null })
  } catch (err) {
    console.error('[notify] Failed to create notification:', err.message)
  }
}

const notifyAdmins = async (message, type, link) => {
  try {
    const admins = await User.find({ role: 'admin' })
    const docs = admins.map((a) => ({ user: a._id, message, type, link: link || null }))
    if (docs.length > 0) await Notification.insertMany(docs)
  } catch (err) {
    console.error('[notify] Failed to notify admins:', err.message)
  }
}

module.exports = { notifyUser, notifyAdmins }