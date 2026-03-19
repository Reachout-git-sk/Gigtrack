# GigTrack — Side Hustle Tracker & Earnings Dashboard

**Author:** Jinam + Sanket  
**Class:** [Your Class Link Here]  
**Objective:** GigTrack is a full-stack web app where students can log gigs, rate clients, track earnings on a visual dashboard, and set monthly income goals with color-coded health statuses.

---

## Screenshot

![GigTrack Screenshot](./screenshot.png)

---

## Tech Stack

- Frontend: React + Vite + React Bootstrap
- Backend: Node.js + Express (ES Modules)
- Database: MongoDB (native driver, no Mongoose)
- Auth: Passport.js + bcrypt + express-session

---

## Build Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Backend Setup

```bash
cd server
cp .env.example .env
# Fill in your MONGO_URI and SESSION_SECRET in .env
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Seed the Database

```bash
cd server
node seed/seedGigs.js
node seed/seedGoals.js
```

### Visit the App

Open `http://localhost:5173` in your browser.

---

## License

MIT
