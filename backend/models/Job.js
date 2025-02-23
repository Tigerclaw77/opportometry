/*
📌 Updating Job Fields? Here's What to Change:
- Add/Remove a Field: Update `models/Job.js`, `routes/jobs.js`, `AddJob.jsx`, `JobList.jsx`
- Make Field Required/Optional: Update `models/Job.js`, `routes/jobs.js`
- Change Frontend Form Inputs: Update `AddJob.jsx`
- Change Job Display: Update `JobList.jsx`
*/


const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  corporation: { type: String, index: true, default: null }, // ✅ Optional
  company: { type: String, required: true },
  hours: { type: String, enum: ["part-time", "full-time", "per diem"], default: null }, // ✅ Optional
  role: { type: String, enum: ["Optometrist", "Ophthalmologist", "Optician"], default: null }, // ✅ Optional
  practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"], default: null },
  status: { type: String, enum: ["open", "closed", "expired"], default: "open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Job", jobSchema);
