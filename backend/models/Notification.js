const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "new_message",
      "job_applied",
      "job_status_update",
      "account_activity",
      "system_announcement",
    ],
    required: true,
  },
  message: { type: String, required: true },
  link: { type: String }, // e.g. `/jobs/abc123`, `/dashboard/applicants`
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
