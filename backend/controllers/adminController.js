import User from "../models/User.js";
import Donation from "../models/Donation.js";
import Claim from "../models/Claim.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === "admin") {
        return res.status(400).json({ message: "Admin users cannot be deleted for security reasons" });
      }
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private/Admin
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).populate("user", "id name");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a donation
// @route   DELETE /api/admin/donations/:id
// @access  Private/Admin
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (donation) {
      await donation.deleteOne();
      res.json({ message: "Donation removed" });
    } else {
      res.status(404).json({ message: "Donation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalClaims = await Claim.countDocuments();
    
    // Additional metrics
    const foodDonations = await Donation.countDocuments({ category: "food" });
    const clothesDonations = await Donation.countDocuments({ category: "clothes" });

    res.json({
      totalUsers,
      totalDonations,
      totalClaims,
      foodDonations,
      clothesDonations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
