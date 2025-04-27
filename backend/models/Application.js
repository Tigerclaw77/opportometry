const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  corporation: { type: String, index: true, default: null },
  company: { type: String, required: true },
  hours: {
    type: String,
    enum: ["part-time", "full-time", "per diem"],
    default: null,
  },
  jobRole: {
    type: String,
    enum: ["Optometrist", "Ophthalmologist", "Optician"],
    default: null,
  },
  practiceMode: {
    type: String,
    enum: ["employed", "contract", "lease", "associate"],
    default: null,
  },
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

module.exports = mongoose.model("Job", jobSchema);
