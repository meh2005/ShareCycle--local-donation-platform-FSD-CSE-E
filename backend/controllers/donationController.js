import Donation from "../models/Donation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ➕ CREATE DONATION
export const createDonation = async (req, res) => {
  try {
    const {
      transactionType,
      category,
      title,
      description,
      condition,
      location,
      coordinates,
      cookedAt,
      expiresAt,
      quantityValue,
      quantityUnit,
      size,
      gender,
      originalPrice,
      resalePrice,
      contact,
      images,
      verified
    } = req.body;

    if (transactionType === "resale" && condition === "used") {
      return res.status(400).json({
        message: "Used items cannot be resold. Please donate instead."
      });
    }

    if (category === "food" && !expiresAt) {
      return res.status(400).json({
        message: "Food items must have expiry time"
      });
    }

    const donation = await Donation.create({
      transactionType,
      category,
      title,
      description,
      condition,
      location,
      coordinates,
      cookedAt,
      expiresAt,
      quantityValue: quantityValue || 1,
      quantityUnit: quantityUnit || "items",
      quantityAvailable: quantityValue || 1,
      size,
      gender,
      originalPrice,
      resalePrice,
      contact,
      images: images || [],
      verified,
      user: req.user._id
    });

    // Notifications based on interests removed since interests were deleted
    // You can implement a global notification or category-based one later if needed
    
    res.status(201).json(donation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET ALL DONATIONS (FEED)
export const getDonations = async (req, res) => {
  try {
    const { transactionType, category, location, role } = req.query;

    let filter = {};

    if (transactionType) filter.transactionType = transactionType;
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    // Fetch and populate user
    let donations = await Donation.find(filter)
      .populate("user", "name mobile role profilePic rating badges verified")
      .sort({ createdAt: -1 });

    // 🔄 REFINED FEED LOGIC
    if (role === "organization") {
      // Organization Hub: Show all posts from organizations
      donations = donations.filter(d => d.user && d.user.role === "organization");
    } else {
      // Main Feed: Show Individual posts + Organization FREE donations
      donations = donations.filter(d => {
        if (!d.user) return false;
        if (d.user.role === "user") return true;
        // Organizations only show in main feed if it's a FREE donation (not resale)
        return d.user.role === "organization" && d.transactionType === "donate";
      });
    }

    // ⏱️ EXPIRY LOGIC (hide expired food)
    const now = new Date();
    const Config = (await import("../models/Config.js")).default;
    const safetyConfig = await Config.findOne({ key: "foodSafetyBuffer" });
    const bufferPercent = safetyConfig ? parseFloat(safetyConfig.value) : 66.6; 

    donations = donations.map((item) => {
      const nowTime = new Date().getTime();
      item = item.toObject(); // Convert to plain object to add properties
      item.isSafe = true;

      if (item.category === "food" && item.expiresAt) {
        const expires = new Date(item.expiresAt).getTime();
        
        // ❌ HARD LIMIT: Past actual expiry
        if (nowTime > expires) {
          item.isSafe = false;
          item.status = "expired";
        } else if (item.cookedAt) {
          // ⏱️ SAFETY BUFFER
          const cooked = new Date(item.cookedAt).getTime();
          const lifetime = expires - cooked;
          const threshold = cooked + (lifetime * bufferPercent) / 100;
          
          if (nowTime > threshold) {
            item.isSafe = false;
            item.status = "expired"; // Use expired status for safety limit
          }
        }
      }
      return item;
    });

    // Still filter out items that are strictly EXPIRED (past hard limit) 
    // or keep them to show the 'Expired' state? 
    // User requested "button should only stay active", so we show them but disable.
    // However, we should probably hide items that are MANY hours past expiry.
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 GET MY DONATIONS
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 GET SINGLE DONATION
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("user", "name mobile role profilePic rating badges");
    if (donation) {
      res.json(donation);
    } else {
      res.status(404).json({ message: "Donation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 UPDATE DONATION
export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (donation) {
      if (donation.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized to update this donation" });
      }

      // Don't allow changing the owner
      delete req.body.user;

      const updatedDonation = await Donation.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json(updatedDonation);
    } else {
      res.status(404).json({ message: "Donation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE DONATION
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (donation) {
      if (donation.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized to delete this donation" });
      }

      await donation.deleteOne();
      res.json({ message: "Donation removed" });
    } else {
      res.status(404).json({ message: "Donation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};