// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const { v4: uuidv4 } = require("uuid"); // Generate unique IDs

// const recruiterInfoSchema = new mongoose.Schema({
//   recruiterType: { type: String, enum: ["corporate", "independent"], default: "independent" },
//   corporation: { type: String, default: null },
//   companyName: { type: String, required: true },
//   jobListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
// });

// const userSchema = new mongoose.Schema({
//   userID: { type: String, default: uuidv4, unique: true },
//   email: { type: String, required: true, unique: true, index: true },
//   password: { type: String, required: true },
//   resetToken: { type: String, default: null }, // ✅ Ensure this field exists
//   resetTokenExpires: { type: Date, default: null }, // ✅ Ensure this field exists
//   userRole: { type: String, enum: ["candidate", "recruiter", "admin"], required: false },
//   status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
//   createdAt: { type: Date, default: Date.now },

//   // ✅ Email Verification Fields
//   isVerified: { type: Boolean, default: false },
//   verificationToken: { type: String, default: null },
//   failedLoginAttempts: { type: Number, default: 0 },

//   // ✅ Profile Fields (Only Essential Fields Required at Registration)
//   profile: {
//     firstName: { type: String, required: false },
//     lastName: { type: String, required: false },
//     rolePreferences: [{ type: String, default: [] }], // ✅ Optional, default empty array
//     workPreference: [{ type: String, enum: ["remote", "in-office", "hybrid"], default: [] }], // ✅ Optional
//     availability: { type: String, enum: ["full-time", "part-time"], default: null }, // ✅ Optional
//     experienceLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: null }, // ✅ Optional
//     resume: { type: String, default: null }, // ✅ Optional, will be added later
//     updatedAt: { type: Date, default: Date.now },

//     // ✅ Job Roles (Optional)
//     jobRoles: [{ 
//       type: String, 
//       enum: [
//         "Optometrist", "Ophthalmologist", "Optician",
//         "Office Manager", "Optometric Tech", "Ophthalmic Tech", "Surgical Tech", "Scribe",
//         "Front Desk/Reception", "Insurance/Billing"
//       ], 
//       default: [] 
//     }],
//   },

//   recruiterInfo: recruiterInfoSchema,

//   // ✅ Profile History (For Tracking Changes)
//   profileHistory: [
//     {
//       profileData: { type: Object },
//       archivedAt: { type: Date, default: Date.now },
//     },
//   ],
// });

// // ✅ Hash the password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Compare provided password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // ✅ Archive Old Profile Before Updating
// userSchema.methods.updateProfile = async function (newProfileData) {
//   if (this.profile) {
//     this.profileHistory.push({ profileData: { ...this.profile }, archivedAt: new Date() });
//   }
//   this.profile = { ...newProfileData, updatedAt: new Date() };
//   await this.save();
// };

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs

/**
 * Recruiter Info Subschema
 */
const recruiterInfoSchema = new mongoose.Schema({
  recruiterType: {
    type: String,
    enum: ["corporate", "independent"],
    default: "independent",
  },
  corporation: { type: String, default: null },
  companyName: { type: String, required: true },
  jobListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
});

/**
 * User Schema
 */
const userSchema = new mongoose.Schema({
  userID: { type: String, default: uuidv4, unique: true },

  // ✅ Authentication Fields
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },

  // ✅ Role & Status
  userRole: {
    type: String,
    enum: ["candidate", "recruiter", "admin"],
    required: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },

  // ✅ Email Verification & Security
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  failedLoginAttempts: { type: Number, default: 0 },

  // ✅ Profile (for Candidates)
  profile: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },

    // Candidate preferences
    rolePreferences: [{ type: String, default: [] }],
    workPreference: [{
      type: String,
      enum: ["remote", "in-office", "hybrid"],
      default: []
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
    updatedAt: { type: Date, default: Date.now },

    // ✅ Candidate job role options (optional)
    jobRoles: [{
      type: String,
      enum: [
        "Optometrist", "Ophthalmologist", "Optician",
        "Office Manager", "Optometric Tech", "Ophthalmic Tech",
        "Surgical Tech", "Scribe", "Front Desk/Reception", "Insurance/Billing"
      ],
      default: []
    }],
  },

  // ✅ Candidate Job Interactions (NEW)
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  watchlistJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  favoriteJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

  // ✅ Recruiter Info (if recruiter)
  recruiterInfo: recruiterInfoSchema,

  // ✅ Profile History (track profile changes)
  profileHistory: [
    {
      profileData: { type: Object },
      archivedAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now }
});

/**
 * Pre-save hook to hash password if modified
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Password comparison method
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Archive old profile data before updating
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

module.exports = mongoose.model("User", userSchema);
