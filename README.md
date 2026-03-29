# EventSphere 🎯

EventSphere is a full-stack Event Management Platform that allows users to discover, register, and manage events seamlessly. It features role-based access for both attendees and organizers, with a clean and responsive UI.

---

## Live Demo 🌍

- **Frontend:** [https://event-management-phi-steel.vercel.app](https://event-management-phi-steel.vercel.app)
- **Backend API:** [https://event-management-backend-dbki.onrender.com](https://event-management-backend-dbki.onrender.com)

---

## Features ✨

- User authentication with JWT (Register / Login)
- Role-based access — Attendee and Organizer
- Browse and search events by name, city, or category
- Register for events with real-time seat tracking
- Admin dashboard to create, edit, and delete events
- User dashboard with registered events and profile
- Animated UI with smooth page transitions
- Fully responsive design for mobile and desktop
- Secure REST APIs with input validation and error handling
- Cloud database with MongoDB Atlas

---

## Tech Stack 💻

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## Project Structure 📁

```
Event_Management/
├── client/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── api.js
│   └── package.json
│
└── server/                   # Node.js backend
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── eventController.js
    │   │   └── registrationController.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Event.js
    │   │   └── Registration.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── events.js
    │   │   └── registrations.js
    │   └── middleware/
    │       └── auth.js
    ├── server.js
    └── package.json
```

---

## Installation ⚙️

**Clone the repository**

```bash
git clone https://github.com/pedapudiakhila/Event_Management.git
cd Event_Management
```

**Backend Setup**

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Run the server:

```bash
npm run dev
```

**Frontend Setup**

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

---

## API Endpoints 🔌

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current logged-in user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event by ID |
| POST | `/api/events` | Create new event (Admin only) |
| PUT | `/api/events/:id` | Update event (Admin only) |
| DELETE | `/api/events/:id` | Delete event (Admin only) |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/registrations/:eventId` | Register for an event |
| GET | `/api/registrations/my` | Get my registrations |
| DELETE | `/api/registrations/:id` | Cancel a registration |

---

## Screenshots 📸

| Page | Description |
|------|-------------|
| Landing Page | Hero section with upcoming events |
| Events Page | Browse and filter all events |
| Event Details | View details and register |
| User Dashboard | View registrations and profile |
| Admin Dashboard | Manage all events with CRUD |

---

## Future Improvements 🚀

- Email confirmation on registration
- Payment gateway integration
- Event image uploads via Cloudinary
- Real-time seat updates using WebSockets
- Export attendee list as CSV/PDF
- Google OAuth login
- Mobile app version

---

## Author 👩‍💻

**Akhila Pedapudi**
- GitHub: [@pedapudiakhila](https://github.com/pedapudiakhila)
- Email: akhilapedapudi19@gmail.com
- LinkedIn: [pedapudi-akhila-19nov2005](https://linkedin.com/in/pedapudi-akhila-19nov2005)

---

## License 📄

This project is open source and available under the [MIT License](LICENSE).
