import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getUsers,
  deleteUser,
  getDonations,
  deleteDonation,
  getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/users").get(protect, admin, getUsers);
router.route("/users/:id").delete(protect, admin, deleteUser);

router.route("/donations").get(protect, admin, getDonations);
router.route("/donations/:id").delete(protect, admin, deleteDonation);

router.route("/stats").get(protect, admin, getDashboardStats);
router.route("/config").get(protect, admin, async (req, res) => {
   const configs = await (await import("../models/Config.js")).default.find();
   res.json(configs);
}).post(protect, admin, async (req, res) => {
   const { key, value } = req.body;
   const Config = (await import("../models/Config.js")).default;
   const config = await Config.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
   res.json(config);
});

export default router;
