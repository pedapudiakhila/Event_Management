# EventSphere 🎯

**Discover. Register. Experience.**

EventSphere is a full-stack event management platform built for seamless event discovery and registration. From free meetups to paid conferences, it handles the entire lifecycle — browsing, secure payment, real-time seat tracking, and instant notifications — wrapped in a polished, animated, dark-mode-ready UI.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</p>

---

## 🌍 Live Demo

| | |
|---|---|
| **Frontend** | [event-management-phi-steel.vercel.app](https://event-management-phi-steel.vercel.app) |
| **Backend API** | [event-management-backend-dbki.onrender.com](https://event-management-backend-dbki.onrender.com) |

---

## ✨ Features

### 🔐 Authentication & Accounts
- Secure JWT-based authentication with **bcrypt** password hashing
- **Google Sign-In** (OAuth 2.0) — one-tap login/signup, auto-links to existing accounts by email
- **Forgot / Reset Password** flow with time-limited tokens, delivered via email
- **"Remember Me"** — extends session from 1 day to 30 days on request
- Password visibility toggle on all password fields
- Role-based access control — **Attendee** and **Organizer (Admin)**
- Editable profile with custom avatar colors and in-app password change (with strength meter)

### 🎟️ Events & Registration
- Browse, search, and filter events by name, city, or category
- Real-time seat availability tracking with live fill-percentage bars
- One-click registration for free events
- Cancel registration anytime (auto-frees the seat)
- Native share sheet (WhatsApp, X, Facebook, copy link) on event pages

### 💳 Payments
- **Razorpay** integration for paid events — UPI, cards, netbanking
- Cryptographically signed payment verification (no registration is created until the signature is validated server-side)
- Seats and registrations are only confirmed after successful payment

### 🔔 Notifications
- In-app notification center with unread badge count
- Users notified on registration confirmation, cancellation, and event updates
- Admins notified on new signups, new registrations, and payments received

### 🎨 Design & UX
- Light and dark themes with a dedicated **semi-formal palette** — serif display headings (Fraunces), richer shadows, and gradient accents in light mode
- Theme-aware reset-password flow (opens in the correct context whether launched from an active session or a fresh email link)
- Fully responsive, mobile-first layouts with animated transitions throughout (Framer Motion)

### 🛠️ Admin Tools
- Full event CRUD (create, edit, delete) with category and pricing controls
- Attendee directory with live search across name, email, and event
- Dashboard analytics: total events, registrations, seat fill rate

### 🔒 Security
- Signed JWTs with configurable expiry
- Hashed password reset tokens (SHA-256), auto-expiring after 1 hour
- Razorpay payment signatures verified server-side before any registration is created
- No user enumeration — password reset responses never reveal whether an email is registered

---

## 💻 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- `@react-oauth/google`

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer (Gmail SMTP)
- Razorpay SDK
- `google-auth-library`

**Deployment**
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📁 Project Structure

```
Event_Management/
├── client/                        # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   └── api.js
│   └── package.json
│
└── server/                        # Node.js backend
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── eventController.js
    │   │   ├── registrationController.js
    │   │   ├── paymentController.js
    │   │   └── notificationController.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Event.js
    │   │   ├── Registration.js
    │   │   └── Notification.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── events.js
    │   │   ├── registrations.js
    │   │   ├── payment.routes.js
    │   │   └── notification.routes.js
    │   ├── utils/
    │   │   ├── sendEmail.js
    │   │   └── notify.js
    │   └── middleware/
    │       └── auth.js
    ├── server.js
    └── package.json
```

---

## ⚙️ Installation

**1. Clone the repository**
```bash
git clone https://github.com/pedapudiakhila/Event_Management.git
cd Event_Management
```

**2. Backend setup**
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

CLIENT_URL=http://localhost:5173

GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_16_char_app_password

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the server:
```bash
npm run dev
```

**3. Frontend setup**
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend:
```bash
npm run dev
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/google` | Sign in / sign up with Google |
| GET | `/api/auth/me` | Get current logged-in user |
| PUT | `/api/auth/profile` | Update name / password |
| POST | `/api/auth/forgot-password` | Request a password reset email |
| POST | `/api/auth/reset-password/:token` | Set a new password using a reset token |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (supports search & category filters) |
| GET | `/api/events/:id` | Get single event by ID |
| POST | `/api/events` | Create new event *(Admin only)* |
| PUT | `/api/events/:id` | Update event *(Admin only)* |
| DELETE | `/api/events/:id` | Delete event *(Admin only)* |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/registrations/:eventId` | Register for a free event |
| GET | `/api/registrations/my` | Get my registrations |
| GET | `/api/registrations/all` | Get all registrations *(Admin only)* |
| DELETE | `/api/registrations/:id` | Cancel a registration |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create a Razorpay order for a paid event |
| POST | `/api/payments/verify` | Verify payment signature & confirm registration |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/my` | Get my notifications |
| PUT | `/api/notifications/:id/read` | Mark a notification as read |
| PUT | `/api/notifications/read-all` | Mark all notifications as read |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Landing Page | Hero section with upcoming events |
| Events Page | Browse, search, and filter all events |
| Event Details | View details, share, and register (with payment for paid events) |
| User Dashboard | Registrations, notifications, and profile management |
| Admin Dashboard | Manage events, view attendees, track registrations |

---

## 🚀 Roadmap

- [ ] Event cover image uploads (Cloudinary)
- [ ] Refunds on cancellation for paid registrations
- [ ] QR code tickets for event check-in
- [ ] Waitlists for full events
- [ ] Admin analytics charts (revenue, registrations over time)
- [ ] Attendee list export (CSV/PDF)
- [ ] Real-time seat updates via WebSockets
- [ ] Email delivery via a dedicated transactional provider
- [ ] Native mobile app

---

## 👩‍💻 Author

**Akhila Pedapudi**
- GitHub: [@pedapudiakhila](https://github.com/pedapudiakhila)
- Email: akhilapedapudi19@gmail.com
- LinkedIn: [pedapudi-akhila-19nov2005](https://linkedin.com/in/pedapudi-akhila-19nov2005)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
