# ♻️ ShareCycle – Local Donation & B2B Resource Sharing Platform

ShareCycle is a comprehensive full-stack MERN application designed to facilitate local community sharing and B2B organization collaboration. It bridges the gap between surplus resources and those in need, featuring a robust moderation system, real-time notifications, and organization-exclusive inventory sharing.

---

## 🌟 Key Features

### 👤 User & Profile System
*   **Role-Based Access:** Distinct workflows for **Users**, **Organizations/NGOs**, and **Administrators**.
*   **Rich Profiles:** Customizable profiles with direct image uploads (Base64 storage) and mobile verification.
*   **Trust System:** Integrated **Rating & Feedback** system where users can rate their donation/collection experience.

### 🍱 Intelligent Donation Engine
*   **Multiple Categories:** Support for Food, Clothes, Toys, Household, Furniture, Medical, and Education.
*   **Smart Expiry (Food):** Advanced logic to track cook time and expiry. Admin-configurable **Safety Buffers** automatically hide listings that reach a certain percentage of their shelf life.
*   **Quantity Management:** Precise tracking of quantities (kgs, ltrs, items, persons) with real-time availability updates.
*   **Transaction Types:** Support for **Donations**, **B2B Resale**, and **Exchanges**.

### 🤝 Organization Collaboration (B2B Hub)
*   **Organization Hub:** An exclusive space for NGOs and verified organizations to collaborate.
*   **Exclusive Inventory:** Organizations can list items for "Org Resale," accessible only to other verified organizations.
*   **Bulk Requests:** Streamlined quantity-based request system for large-scale sharing.

### 🛡️ Admin Control Panel
*   **Centralized Moderation:** Monitor all users and listings with the power to remove non-compliant content.
*   **Live Analytics:** Dashboard stats for total engagement (Users, Donations, Claims).
*   **Global Configuration:** Dynamically adjust the "Food Safety Buffer" to enforce community health standards.

### 🔄 Advanced Claim System
*   **Two-Way Workflow:** Real-time request-approval system with owner control.
*   **Notifications:** Instant alerts for new requests, approvals, and rejections.
*   **Status Tracking:** Visual tracking of item states: `Available` ➔ `Requested` ➔ `Claimed`.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js (Vite), Tailwind CSS, Lucide React, Framer Motion, Axios.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (via Mongoose).
*   **Auth:** JWT (JSON Web Tokens), BcryptJS.
*   **Images:** Cloudinary for listing images & MongoDB Base64 for profile pictures.

---

## 📁 Project Structure

```text
ShareCycle/
├── backend/            # Express Server
│   ├── controllers/    # Business Logic (Auth, Donations, Claims, Admin, etc.)
│   ├── models/         # Database Schemas (User, Donation, Claim, Config, Notification)
│   ├── routes/         # API Endpoints
│   ├── middleware/     # Auth & Error Handling
│   └── server.js       # Main Entry Point
├── frontend/           # React Client
│   ├── src/
│   │   ├── pages/      # Dashboards, Hubs, Auth, and Landing Pages
│   │   ├── components/ # Reusable UI Components (Cards, Modals, Navbar)
│   │   ├── services/   # API (Axios Interceptors)
│   │   └── App.jsx     # Routing Logic
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Cloudinary Account (Optional, for listing images)

### 2. Backend Setup
1.  `cd backend`
2.  `npm install`
3.  Create `.env`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/local_donation
    JWT_SECRET=your_secret_key
    ```
4.  `npm run dev`

### 3. Frontend Setup
1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`
4.  Verify `frontend/src/services/api.js` points to: `http://localhost:5000/api`

---

## 🧪 Comprehensive Test Flow

1.  **Register:** Create an Admin account (use `seedAdmin.js` if provided) and two User accounts (one as 'Organization').
2.  **Admin Setup:** Log in as Admin to `http://localhost:5173/admin-login` and set the **Food Safety Buffer**.
3.  **Create Listing:** Log in as an Organization and post a "Medical" item for "Org Resale".
4.  **Claim (B2B):** Log in as a User (cannot see resale) vs another Organization (can see and request quantity).
5.  **Approve & Rate:** Accept the request in the owner dashboard. Once claimed, the requester can leave a **Star Rating**.
6.  **Notifications:** Check the bell icon to see real-time updates for each step.

---

## 🛠 Troubleshooting

*   **B2B Listings:** If you can't see "Resale" items, ensure your user role is set to `organization`.
*   **Food Expiry:** Items might disappear from the feed if they pass the **Safety Buffer** set in the Admin Panel.
*   **Profile Pictures:** Profile images are saved directly to the database. If they fail, check the file size (limit is 2MB).
*   **API Connection:** Ensure the backend is running on port 5000 and MongoDB is connected.

---
**Build, Share, and Cycle!** ♻️
