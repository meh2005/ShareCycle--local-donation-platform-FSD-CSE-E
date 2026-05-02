# ♻️ ShareCycle – Local Donation & Resource Sharing Platform

ShareCycle is a full-stack MERN application designed to facilitate local community sharing. It allows users to donate surplus food, clothes, and other items, while enabling those in need to claim them through a verified and streamlined process.

---

## 🚀 Features

### 🔐 User Authentication
*   **Secure Access:** User registration and login system.
*   **Recovery:** Password reset with Email + Mobile verification.
*   **Role-Based Views:** Personalized dashboards for owners and claimants.

### 🍱 Donation Categories
*   **Food:** Specify cook time, quantity, and safety details.
*   **Clothes:** List various types of clothing for donation.
*   **Resale:** Option for resale items with a verification checkbox.

### 🔄 Claim Management System
*   **Claim Requests:** Users can request items they need.
*   **Owner Control:** Owners can **Accept** or **Reject** claim requests.
*   **Live Status Tracking:** Real-time updates (Available / Requested / Claimed).

---

## 🛠️ Technology Stack

*   **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (via Mongoose).
*   **Authentication:** JSON Web Tokens (JWT) & BcryptJS.
*   **File Storage:** Cloudinary integration for images.

---

## 📁 Project Structure

```text
ShareCycle/
├── backend/            # Express.js Server & MongoDB Models
│   ├── controllers/    # Request logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/           # React + Vite Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── services/   # API configuration
│   │   └── pages/      # Main application views
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or above)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 2️⃣ Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your credentials:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/local_donation
    JWT_SECRET=your_secret_key_here
    # Optional: Cloudinary for image uploads
    CLOUDINARY_CLOUD_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *Backend runs at: `http://localhost:5000`*

### 3️⃣ Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Verify API Configuration in `frontend/src/services/api.js`:
    ```javascript
    baseURL: "http://localhost:5000/api"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *Frontend runs at: `http://localhost:5173`*

---

## 🧪 Recommended Test Flow

1.  **Register:** Create two different accounts.
2.  **Donate:** Log in as User A and create a donation (Food, Clothes, or Resale).
3.  **Claim:** Log out and log in as User B. Browse available items and click "Claim".
4.  **Approve:** Log back in as User A. Go to your dashboard and **Accept** the claim request.
5.  **Verify:** Check the donation status—it should now be marked as **Claimed**.

---

## 🛠 Troubleshooting

*   **MongoDB Connection:** If the backend fails to start, ensure your MongoDB service is running.
*   **Port Conflicts:** If port 5173 is busy, Vite will notify you of the new port in the terminal.
*   **Images Not Showing:** Ensure your Cloudinary credentials in `.env` are correct.
*   **API Errors:** Double-check that the backend is running and the `baseURL` in the frontend matches the backend address.

---
**Happy Sharing!** ♻️
