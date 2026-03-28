const express = require('express')
const router = express.Router()
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', getAllEvents)
router.get('/:id', getEventById)
router.post('/', protect, adminOnly, createEvent)
router.put('/:id', protect, adminOnly, updateEvent)
router.delete('/:id', protect, adminOnly, deleteEvent)

module.exports = router