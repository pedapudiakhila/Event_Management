const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  amountPaid: { type: Number, default: 0 }
}, { timestamps: true })

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true })

module.exports = mongoose.model('Registration', registrationSchema)