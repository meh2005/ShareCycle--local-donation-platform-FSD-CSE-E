import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔑 Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// 📝 REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required (Name, Email, Password, Mobile)" });
    }

    // Security: Reserve 'admin' name
    if (name.toLowerCase() === "admin") {
      return res.status(400).json({ message: "The name 'admin' is reserved for system use" });
    }

    // Check user exists based on combination
    const userExists = await User.findOne({ name, email, mobile });
    if (userExists) {
      return res.status(400).json({ message: "User with this combination already exists" });
    }

    // Create user
    const role = req.body.role === "organization" ? "organization" : "user";
    
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      role
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profilePic: user.profilePic,
      rating: user.rating,
      badges: user.badges,
      verified: user.verified,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      $or: [
        { email: email },
        { name: email, role: "admin" } // Only allow name-based login for admin role
      ]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        rating: user.rating,
        badges: user.badges,
        verified: user.verified,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, mobile, newPassword } = req.body;

    // check user
    const user = await User.findOne({ email, mobile });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or mobile" });
    }

    // set new password (will be hashed automatically)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.name && req.body.name.toLowerCase() === "admin") {
        return res.status(400).json({ message: "The name 'admin' is reserved" });
      }

      const newName = req.body.name || user.name;
      const newEmail = (req.body.email || user.email).toLowerCase();
      const newMobile = req.body.mobile || user.mobile;

      // Check if any other user already has this exact combination
      const existingUser = await User.findOne({
        name: newName,
        email: newEmail,
        mobile: newMobile,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(400).json({ message: "A profile with this Name, Email, and Mobile already exists" });
      }

      user.name = newName;
      user.email = newEmail;
      user.mobile = newMobile;

      if (req.body.profilePic !== undefined) {
        user.profilePic = req.body.profilePic;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        rating: updatedUser.rating,
        badges: updatedUser.badges,
        verified: updatedUser.verified,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        rating: user.rating,
        badges: user.badges,
        verified: user.verified,
        token: generateToken(user._id)
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};