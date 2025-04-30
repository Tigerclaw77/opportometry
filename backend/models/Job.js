const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  corporation: { type: String, index: true, default: null },
  company: { type: String, required: true },

  hours: {
    type: String,
    enum: [
      "part-time",
      "full-time",
      "per diem",
      "flexible",
      "weekends",
      "evenings",
    ],
    default: null,
  },

  jobRole: {
    type: String,
    enum: [
      "Optometrist",
      "Ophthalmologist",
      "Optician",
      "Technician",
      "Office Manager",
      "Front Desk",
    ],
    default: null,
  },

  practiceMode: {
    type: String,
    enum: [
      "employed",
      "contract",
      "lease",
      "associate",
      "buy-in",
      "locum",
      "owner-track",
    ],
    default: null,
  },

  setting: {
    type: String,
    enum: [
      "private",
      "group",
      "chain",
      "big box",
      "hospital",
      "academic",
      "mobile",
      "govt",
    ],
    default: null,
  },

  chainAffiliation: {
    type: String,
    enum: [
      "Luxottica",
      "National Vision",
      "Walmart",
      "Costco",
      "Target Optical",
      "LensCrafters",
      "Visionworks",
      "Pearle Vision",
      "Warby Parker",
      "Stanton Optical",
      "Other",
      null,
    ],
    default: null,
  },

  ownershipTrack: {
    type: String,
    enum: ["Ownership Path", "Franchise", "Equity Option", "None"],
    default: "None",
  },

  payStructure: {
    type: String,
    enum: [
      "Salary",
      "Base + Production",
      "Daily",
      "Hourly",
      "Bonus",
      "Negotiable",
    ],
    default: null,
  },

  tags: [{ type: String }], // e.g., ["New Grad Friendly", "Visa Sponsor", "EMR: Crystal"]

  status: {
    type: String,
    enum: ["open", "closed", "expired"],
    default: "open",
  },

  location: {
    city: { type: String },
    state: { type: String, index: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  views: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
module.exports = Job;
