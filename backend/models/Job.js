const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  corporation: { type: String, required: true, index: true }, // ✅ Indexed for faster queries
  company: { type: String, required: true },
  hours: { type: String, enum: ["part-time", "full-time", "per diem"], required: true },
  role: { type: String, enum: ["Optometrist", "Ophthalmologist", "Optician"], required: true, index: true }, // ✅ Indexed
  practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"], required: true },
  status: { type: String, enum: ["open", "closed", "expired"], default: "open" }, // ✅ Track job status
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  // ✅ Track which candidates saved this job
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Job", jobSchema);
