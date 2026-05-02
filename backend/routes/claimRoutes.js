import express from "express";
import {requestClaim, acceptClaim, rejectClaim, submitFeedback, getClaims } from "../controllers/claimController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requestClaim);
router.put("/:id/accept", protect, acceptClaim);
router.put("/:id/reject", protect, rejectClaim);
router.post("/:id/feedback", protect, submitFeedback);
router.get("/", protect, getClaims);

export default router;