const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technology', 'Entertainment', 'Business', 'Cultural'],
    required: true
  },
  date: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  location: { type: String, required: true },
  venue: { type: String, required: true },
  seats: { type: Number, required: true },
  registered: { type: Number, default: 0 },
  price: { type: String, default: 'Free' },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)