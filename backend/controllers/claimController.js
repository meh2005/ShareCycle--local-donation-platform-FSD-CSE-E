import Claim from "../models/Claim.js";
import Donation from "../models/Donation.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// 📩 REQUEST (CLAIM)
export const requestClaim = async (req, res) => {
  try {
    const { donationId, quantityRequested, exchangeItem } = req.body;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    // 🏢 Organization Restrictions
    const donor = await User.findById(donation.user);
    if (donor && donor.role === "organization") {
       if (donation.transactionType === "resale" && req.user.role !== "organization") {
          return res.status(403).json({ 
             message: "This resale item is only available for other Organizations/NGOs." 
          });
       }
    }

    const requestedAmount = quantityRequested || 1;
    if (requestedAmount > donation.quantityAvailable) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    const existing = await Claim.findOne({
      donation: donationId,
      requester: req.user._id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "Already have a pending request for this item" });
    }

    const claim = await Claim.create({
      donation: donationId,
      requester: req.user._id,
      quantityRequested: requestedAmount,
      exchangeItem: exchangeItem || null
    });

    donation.requests.push({
      userId: req.user._id,
      status: "pending"
    });

    donation.status = "requested";
    await donation.save();

    // 🔔 Notify Owner
    await Notification.create({
       user: donation.user,
       message: `New request for "${donation.title}" from ${req.user.name}`,
       relatedDonation: donation._id
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ACCEPT CLAIM
export const acceptClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("donation");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.donation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (claim.quantityRequested > claim.donation.quantityAvailable) {
      return res.status(400).json({ message: "Not enough quantity available to accept this claim" });
    }

    claim.status = "accepted";
    await claim.save();

    // Deduct quantity
    claim.donation.quantityAvailable -= claim.quantityRequested;

    if (!claim.donation.requests) claim.donation.requests = [];

    claim.donation.requests = claim.donation.requests.map((r) =>
      r.userId.toString() === claim.requester.toString()
        ? { ...r._doc, status: "accepted" }
        : r
    );

    if (claim.donation.quantityAvailable <= 0) {
      claim.donation.status = "claimed";
      // Auto reject pending claims if no quantity left
      await Claim.updateMany(
        { donation: claim.donation._id, status: "pending" },
        { status: "rejected" }
      );
      claim.donation.requests = claim.donation.requests.map((r) =>
        r.status === "pending" ? { ...r._doc, status: "rejected" } : r
      );
    }

    await claim.donation.save();
    
    // 🔔 Notify Requester
    await Notification.create({
       user: claim.requester,
       message: `Your request for "${claim.donation.title}" was accepted!`,
       relatedDonation: claim.donation._id
    });

    res.json({ message: "Claim accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ REJECT CLAIM
export const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("donation");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.donation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    claim.status = "rejected";
    await claim.save();

    if (claim.donation.requests) {
      claim.donation.requests = claim.donation.requests.map((r) =>
        r.userId.toString() === claim.requester.toString()
          ? { ...r._doc, status: "rejected" }
          : r
      );
      await claim.donation.save();
    }

    // 🔔 Notify Requester
    await Notification.create({
       user: claim.requester,
       message: `Your request for "${claim.donation.title}" was declined.`,
       relatedDonation: claim.donation._id
    });

    res.json({ message: "Claim rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 GET CLAIMS (Received or Sent)
export const getClaims = async (req, res) => {
  try {
    const { type } = req.query; // 'received' or 'sent'

    if (type === "sent") {
      // 1. Find all claims made BY this user
      const claims = await Claim.find({ requester: req.user._id })
        .populate("donation")
        .populate("requester", "name mobile profilePic email")
        .populate("exchangeItem")
        .sort({ createdAt: -1 });
      return res.json(claims);
    }

    // Default: Find all claims received FOR this user's donations
    const userDonations = await Donation.find({ user: req.user._id }).select("_id");
    const donationIds = userDonations.map(d => d._id);

    const claims = await Claim.find({ donation: { $in: donationIds } })
      .populate("donation")
      .populate("requester", "name mobile profilePic email")
      .populate("exchangeItem")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 SUBMIT FEEDBACK
export const submitFeedback = async (req, res) => {
  try {
    const { feedbackText, ratingGiven } = req.body;
    const claim = await Claim.findById(req.params.id).populate("donation");

    if (!claim) return res.status(404).json({ message: "Claim not found" });
    
    // Only requester can give feedback, and only if accepted
    if (claim.requester.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (claim.status !== "accepted") {
      return res.status(400).json({ message: "Can only review accepted claims" });
    }
    if (claim.ratingGiven) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    claim.feedbackText = feedbackText;
    claim.ratingGiven = ratingGiven;
    await claim.save();

    // Update donor's rating
    const donor = await User.findById(claim.donation.user);
    if (donor) {
      // Very simple average logic (ideally track number of ratings)
      // For now we just add a small bump or recalculate
      const allClaims = await Claim.find({ status: "accepted", ratingGiven: { $exists: true } }).populate("donation");
      const donorClaims = allClaims.filter(c => c.donation.user.toString() === donor._id.toString());
      
      const totalRating = donorClaims.reduce((acc, curr) => acc + curr.ratingGiven, 0);
      donor.rating = donorClaims.length > 0 ? (totalRating / donorClaims.length).toFixed(1) : ratingGiven;
      
      // Award badges based on rating
      if (donor.rating >= 4.5 && !donor.badges.includes("Top Donor")) {
        donor.badges.push("Top Donor");
      }
      
      await donor.save();
    }

    res.json({ message: "Feedback submitted successfully", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};