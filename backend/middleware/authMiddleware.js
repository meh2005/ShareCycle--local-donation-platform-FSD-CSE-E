import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found, session invalid" });
      }

      return next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return res.status(401).json({ message: "Session expired, please login again" });
    }
  }

  console.log("No token provided in headers");
  return res.status(401).json({ message: "Not authorized, no token" });
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.log("Admin blocked:", req.user?.name, "Role:", req.user?.role);
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

export { protect, admin };