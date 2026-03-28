const Event = require('../models/Event')

const getAllEvents = async (req, res) => {
  try {
    const { category, search } = req.query
    let filter = {}
    if (category) filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }
    const events = await Event.find(filter).populate('organizer', 'name email')
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email')
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user.id })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' })
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' })
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent }