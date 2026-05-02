import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    mobile: {
        type: String,
        required: true, 
        match: [/^\+?[0-9]{10,14}$/, "Enter valid mobile number"]
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "organization"],
      default: "user"
    },
    profilePic: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      default: 0
    },
    badges: {
      type: [String],
      default: []
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 🔍 Compound Unique Index: Name + Email + Mobile
userSchema.index({ name: 1, email: 1, mobile: 1 }, { unique: true });

// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);