# 🤝 ShareCycle – Project Setup Guide

---

## 📌 1. Requirements

Make sure the following are installed:

* Node.js (v16 or above)
* npm (comes with Node.js)
* MongoDB (local or MongoDB Atlas)

---

## 📁 2. Project Structure

```
project-folder/
├── backend/
├── frontend/
├── README.md
```

---

## ⚙️ 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Example:

```
MONGO_URI=mongodb://127.0.0.1:27017/sharecycleDB
```

Start backend server:

```bash
npm run dev
```

or

```bash
node server.js
```

Backend runs at:
👉 http://localhost:5000

---

## 💻 4. Frontend Setup (Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
👉 http://localhost:5173

> ⚠️ If port 5173 is busy, Vite may automatically use another port.

---

## 🔗 5. Important Configuration

Check API base URL:

📁 `frontend/services/api.js`

```js
baseURL: "http://localhost:5000"
```

---

## ▶️ 6. Running the Project

1. Start backend first
2. Then start frontend
3. Open browser:

👉 http://localhost:5173

---

## ✨ 7. Features Included

* User Registration & Login
* Password Reset (Email + Mobile verification)

### Donation Types:

* 🍱 Food (cook time + quantity)
* 👕 Clothes
* 💰 Resale (with verification checkbox)

### System Features:

* Claim Request System
* Owner Approval (Accept / Reject)
* Status Tracking (Available / Requested / Claimed)

---

## 🧪 8. Test Flow

1. Register a user
2. Login
3. Create a donation
4. Logout
5. Login as another user
6. Claim donation
7. Login as owner
8. Accept / Reject claim

---

## 🛠 9. Troubleshooting

* Backend not running → Check MongoDB
* API errors → Ensure backend is on port 5000
* Login issues → Verify API baseURL

---

## ✅ END
