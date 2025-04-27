const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

/**
 * ✅ User Schema Definition
 */
const userSchema = new mongoose.Schema({
  // Legacy UUID — now use _id for internal logic
  userID: { type: String, default: uuidv4, unique: true },

  // ✅ Auth & Status
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  userRole: {
    type: String,
    enum: ["candidate", "recruiter", "admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },

  // ✅ Email Verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  failedLoginAttempts: { type: Number, default: 0 },

  // ✅ Unified Profile
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    updatedAt: { type: Date, default: Date.now },

    // Candidate-specific fields
    jobRoles: [{
      type: String,
      enum: [
        "Optometrist", "Ophthalmologist", "Optician",
        "Office Manager", "Optometric Tech", "Ophthalmic Tech",
        "Surgical Tech", "Scribe", "Front Desk/Reception", "Insurance/Billing"
      ],
      default: [],
    }],
    workPreference: [{
      type: String,
      enum: ["remote", "in-office", "hybrid"],
      default: [],
    }],
    availability: {
      type: String,
      enum: ["full-time", "part-time"],
      default: null,
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: null,
    },
    resume: { type: String, default: null },
    tier: { type: Number, default: 0 },

    // Recruiter-specific fields
    recruiterType: {
      type: String,
      enum: ["corporate", "independent"],
      default: "independent",
    },
    corporation: { type: String, default: null },
    companyName: { type: String, default: null },
  },

  // ✅ Job Interactions (candidates only)
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  watchlistJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  favoriteJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

  // ✅ Profile history for auditing
  profileHistory: [{
    profileData: { type: Object },
    archivedAt: { type: Date, default: Date.now },
  }],

  createdAt: { type: Date, default: Date.now },
});

/**
 * ✅ Pre-save Hook: Hash password if modified
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * ✅ Instance Method: Compare entered password to stored hash
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * ✅ Instance Method: Update profile and archive previous version
 */
userSchema.methods.updateProfile = async function (newProfileData) {
  if (this.profile) {
    this.profileHistory.push({
      profileData: { ...this.profile },
      archivedAt: new Date(),
    });
  }
  this.profile = { ...newProfileData, updatedAt: new Date() };
  await this.save();
};

/**
 * ✅ Export User model
 */
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
