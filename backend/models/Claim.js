import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    quantityRequested: {
      type: Number,
      default: 1
    },
    exchangeItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: false
    },
    feedbackText: {
      type: String
    },
    ratingGiven: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);