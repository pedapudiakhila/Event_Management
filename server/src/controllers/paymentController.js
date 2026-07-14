const Razorpay = require('razorpay')
const crypto = require('crypto')
const Event = require('../models/Event')
const Registration = require('../models/Registration')
const { notifyUser, notifyAdmins } = require('../utils/notify')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async (req, res) => {
  try {
    const { eventId } = req.body
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    if (!event.priceAmount || event.priceAmount <= 0) {
      return res.status(400).json({ message: 'This event is free — no payment required' })
    }

    if (event.seats - event.registered <= 0) {
      return res.status(400).json({ message: 'No seats available' })
    }

    const existing = await Registration.findOne({ user: req.user.id, event: eventId })
    if (existing) return res.status(400).json({ message: 'Already registered' })

    const order = await razorpay.orders.create({
      amount: Math.round(event.priceAmount * 100),
      currency: 'INR',
      receipt: ('evt_' + eventId + '_' + req.user.id).slice(0, 40),
      notes: { eventId: eventId, userId: req.user.id }
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { eventId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const signBody = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest('hex')

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (event.seats - event.registered <= 0) {
      return res.status(400).json({ message: 'No seats available' })
    }

    const existing = await Registration.findOne({ user: req.user.id, event: eventId })
    if (existing) return res.status(400).json({ message: 'Already registered' })

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amountPaid: event.priceAmount
    })

    await Event.findByIdAndUpdate(eventId, { $inc: { registered: 1 } })

    notifyUser(req.user.id, `Payment successful! You're registered for "${event.title}".`, 'registration_confirmed', '/dashboard')
    notifyAdmins(`New registration for "${event.title}"`, 'new_registration', '/admin')
    notifyAdmins(`Payment received: ₹${event.priceAmount} for "${event.title}"`, 'payment_received', '/admin')

    res.status(201).json(registration)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createOrder, verifyPayment }