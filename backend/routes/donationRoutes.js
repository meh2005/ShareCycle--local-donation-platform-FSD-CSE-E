import express from "express";
import { createDonation, getDonations, getDonationById, updateDonation, deleteDonation, getMyDonations } from "../controllers/donationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyDonations);

// Public
router.get("/", getDonations);
router.get("/:id", getDonationById);

// Protected
router.route("/").post(protect, createDonation);
router.route("/:id")
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

export default router;