const mongoose = require("mongoose");

const hiddenJobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.models.HiddenJob || mongoose.model("HiddenJob", hiddenJobSchema);
