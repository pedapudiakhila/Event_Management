const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/events', require('./src/routes/events'))
app.use('/api/registrations', require('./src/routes/registrations'))
app.use('/api/payments', require('./src/routes/payment.routes'))
app.use('/api/notifications', require('./src/routes/notification.routes'))

// Health check
app.get('/', (req, res) => res.json({ message: 'EventSphere API running' }))

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`))
  })
  .catch(err => console.log(err))