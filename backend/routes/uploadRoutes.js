import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    
    const imageUrls = req.files.map((file) => {
       if (file.path && file.path.startsWith("http")) {
          return file.path; // Cloudinary URL
       }
       return `http://localhost:5000/uploads/${file.filename}`; // Local URL
    });
    
    res.status(200).json({
      message: "Images uploaded successfully",
      urls: imageUrls,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images", error: error.message });
  }
});

export default router;
