import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["donate", "resale", "exchange"],
      required: true
    },
    category: {
      type: String,
      enum: ["food", "clothes", "toys", "household", "furniture", "other"],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    // ✅ Updated condition (removed enum restriction)
    condition: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },

    // 🍱 Food fields
    cookedAt: Date,
    expiresAt: Date,
    quantityValue: {
      type: Number,
      default: 1
    },
    quantityUnit: {
      type: String,
      enum: ["ltrs", "kgs", "persons", "items"],
      default: "items"
    },
    quantityAvailable: {
      type: Number,
      default: 1
    },

    // 👕 Clothes fields
    size: String,
    gender: String,

    // 💰 Resale fields
    originalPrice: Number,
    resalePrice: Number,

    contact: {
      type: String,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ NEW: Request system
    requests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending"
        }
      }
    ],

    // ✅ Status
    status: {
      type: String,
      enum: ["available", "requested", "claimed"],
      default: "available"
    },

    // ✅ Verified resale
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);