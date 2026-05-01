# 🌟 SpotLight AI – Smart Parking & EV Navigation System

SpotLight AI is an intelligent smart parking and EV station discovery platform that helps users find nearby parking spots with AI-based predictions, real-time map navigation, and modern UI/UX.

It combines **AI scoring, geolocation, maps, and backend APIs** to provide a Google Maps–like experience for smart parking.

---

## 🚀 Features

### 🧠 AI-Powered Parking Prediction

* Predicts best parking spots based on:

  * Distance
  * Demand probability
  * Traffic simulation
  * AI scoring
* Shows **High / Medium / Low probability** spots.

### 🗺️ Interactive Map (Google Maps Style)

* User location detection
* Destination search (Google Geocoding API)
* Parking markers with smart icons
* Route line from user → parking spot
* Radius search visualization
* Bottom sheet listing nearby spots

### ⚡ EV Station Finder

* Nearby EV charging stations
* Status & power rating
* Navigation support

### 👤 Authentication System

* Signup & Login
* JWT-based authentication
* MySQL user database
* Protected routes

### 📊 Dashboard

* Smart metrics:

  * Nearby spots
  * Best probability
  * Traffic level
  * EV stations
* AI recommendations
* AI assistant panel

### 🎨 Modern UI / UX

* Tailwind CSS + ShadCN UI
* Dark / Light mode
* Framer Motion animations
* Responsive layout

### 🧩 Backend System

* Express.js API
* MySQL database
* AI-based prediction logic
* REST APIs for parking, EV stations, users

---

## 🏗️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* ShadCN UI
* Google Maps JavaScript API
* Framer Motion
* React Query

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* bcrypt (password hashing)

### APIs & Tools

* Google Maps Navigation Links

### Google Maps Platform (Enabled)

* Maps JavaScript API
* Places API
* Directions API
* Geocoding API

---

## 📂 Project Structure

```
Best-Of/
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Dashboard, MapView, Login, Signup, Settings
│   │   ├── context/     # AuthContext
│   │   ├── hooks/       # Custom hooks
│   │   └── App.tsx
│
├── server/              # Backend (Express + MySQL)
│   ├── routes/          # API routes
│   ├── storage.ts       # DB logic & AI predictions
│   ├── db.ts            # MySQL connection
│   └── index.ts         # Server entry
│
├── shared/              # Shared schemas & routes
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/spotlight-ai.git
cd spotlight-ai
```

---

### 2️⃣ Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

### 3️⃣ Setup MySQL Database

Create database:

```sql
CREATE DATABASE spotlight_ai;
```

Create tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parking_spots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  lat DOUBLE,
  lng DOUBLE,
  probability FLOAT,
  city_id INT
);
```

---

### 4️⃣ Run Backend Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

### 5️⃣ Run Frontend

```bash
cd client
npm run dev
```

App will run at:

```
http://localhost:5173
```

(or your configured port)

---

## 🧪 API Example

Search parking spots:

```
GET /api/parking/search?lat=19.076&lng=72.8777&radius=1000
```

Response:

```json
{
  "spots": [
    {
      "id": 1,
      "name": "Parking Zone A",
      "probability": "High",
      "score": 82
    }
  ]
}
```

---

## 📸 Screenshots (You Can Add Later)

* Dashboard
* Map View
* Login / Signup
* AI Assistant
* EV Stations

(You can upload screenshots to GitHub and link them here.)

---

## 🌍 Future Improvements

* Real-time traffic data integration
* Machine learning model for predictions
* Admin panel for parking data
* Mobile app (React Native / Flutter)
* Real-world IoT parking sensors
* Role-based authentication

---

## 👨‍💻 Author

**Anuj Shelke**

* 💻 Full Stack Developer
* 🚀 Project: SpotLight AI
* 📍 India

---
