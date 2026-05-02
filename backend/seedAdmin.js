import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Check if admin exists
    let admin = await User.findOne({ name: "admin" });

    if (admin) {
      console.log("Admin exists, updating password and role...");
      admin.password = "admin123";
      admin.role = "admin";
      admin.email = admin.email || "admin@donatemzp.com"; // Ensure email exists for schema
      admin.mobile = admin.mobile || "9999999999"; // Ensure mobile exists
      await admin.save();
    } else {
      console.log("Creating new super admin...");
      await User.create({
        name: "admin",
        email: "admin@donatemzp.com",
        password: "admin123",
        mobile: "9999999999",
        role: "admin"
      });
    }

    console.log("SUCCESS: Super Admin created/updated.");
    console.log("Username: admin");
    console.log("Password: admin123");
    
    process.exit();
  } catch (err) {
    console.error("ERROR Seeding Admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
