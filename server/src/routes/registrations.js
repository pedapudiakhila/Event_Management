const express = require('express')
const router = express.Router()
const { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations, getAllRegistrations } = require('../controllers/registrationController')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/:eventId', protect, registerForEvent)
router.get('/my', protect, getMyRegistrations)
router.get('/all', protect, adminOnly, getAllRegistrations)
router.delete('/:id', protect, cancelRegistration)
router.get('/event/:eventId', protect, adminOnly, getEventRegistrations)

module.exports = router