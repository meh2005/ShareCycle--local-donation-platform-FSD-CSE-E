import express from "express";
import { registerUser, loginUser, updateProfile, resetPassword, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

export default router;