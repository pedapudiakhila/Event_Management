const Registration = require('../models/Registration')
const Event = require('../models/Event')

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (event.seats - event.registered <= 0)
      return res.status(400).json({ message: 'No seats available' })

    const existing = await Registration.findOne({ user: req.user.id, event: req.params.eventId })
    if (existing) return res.status(400).json({ message: 'Already registered' })

    const registration = await Registration.create({
      user: req.user.id,
      event: req.params.eventId
    })

    await Event.findByIdAndUpdate(req.params.eventId, { $inc: { registered: 1 } })
    res.status(201).json(registration)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event')
    res.json(registrations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
    if (!registration) return res.status(404).json({ message: 'Registration not found' })
    if (registration.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' })

    await Registration.findByIdAndDelete(req.params.id)
    await Event.findByIdAndUpdate(registration.event, { $inc: { registered: -1 } })
    res.json({ message: 'Registration cancelled' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email')
    res.json(registrations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations }