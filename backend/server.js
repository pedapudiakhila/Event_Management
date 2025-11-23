const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const DATA_FILE = './data/events.json';

// Helper to read/write events
const readEvents = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeEvents = (events) => fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));

// Get all events
app.get('/events', (req, res) => {
  const events = readEvents();
  res.json(events);
});

// Admin: add event
app.post('/events', (req, res) => {
  const events = readEvents();
  const newEvent = { id: Date.now(), ...req.body, registeredUsers: [] };
  events.push(newEvent);
  writeEvents(events);
  res.json(newEvent);
});

// Admin: delete event
app.delete('/events/:id', (req, res) => {
  let events = readEvents();
  events = events.filter(e => e.id != req.params.id);
  writeEvents(events);
  res.json({ message: 'Event deleted' });
});

// User: register for event
app.post('/events/register/:id', (req, res) => {
  const events = readEvents();
  const event = events.find(e => e.id == req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { userName } = req.body;
  event.registeredUsers.push(userName);
  writeEvents(events);
  res.json({ message: 'Registered successfully', event });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
