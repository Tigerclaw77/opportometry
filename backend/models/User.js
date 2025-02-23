// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const { v4: uuidv4 } = require("uuid"); // Generate unique IDs

// const userSchema = new mongoose.Schema({
//   userID: { type: String, default: uuidv4, unique: true }, // Unique user identifier
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, index: true }, // Unique and indexed for quick lookups
//   password: { type: String, required: true }, // Hashed password
//   role: { type: String, enum: ["candidate", "recruiter", "admin"], required: true }, // ✅ Added "admin" role
//   corporation: { type: String, required: function() { return this.role === "recruiter"; } }, // ✅ Required for recruiters
//   tier: { type: Number, default: 0 }, // ✅ Tier system for premium features (0 = basic, 1 = pro, etc.)
//   status: { type: String, enum: ["active", "inactive", "banned"], default: "active" }, // ✅ Added "banned"
//   createdAt: { type: Date, default: Date.now },

//   // ✅ Job Templates (For Recruiters)
//   jobTemplates: [
//     {
//       title: { type: String, required: true },
//       description: { type: String, required: true },
//       hours: { type: String, enum: ["part-time", "full-time", "per diem"] },
//       role: { type: String, enum: ["Optometrist", "Ophthalmologist", "Optician"] },
//       practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"] },
//     },
//   ],
// });

// // ✅ Hash the password before saving the user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Method to compare provided password with the hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs

const userSchema = new mongoose.Schema({
  userID: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["candidate", "recruiter", "admin"], required: true },
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
  createdAt: { type: Date, default: Date.now },

  // ✅ Profile Fields (Common for All Users)
  profile: {
    title: { type: String, enum: ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."] },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    rolePreferences: [{ type: String }], // List of preferred roles
    workPreference: [{ type: String, enum: ["remote", "in-office", "hybrid"] }], // Work type
    availability: { type: String, enum: ["full-time", "part-time"] },
    experienceLevel: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    resume: { type: String }, // URL to uploaded resume
    updatedAt: { type: Date, default: Date.now },
  },

  // ✅ Recruiter-Specific Fields (Optional)
  recruiterInfo: {
    corporation: { type: String },
    jobTemplates: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        hours: { type: String, enum: ["part-time", "full-time", "per diem"] },
        role: { type: String, enum: ["Optometrist", "Ophthalmologist", "Optician"] },
        practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"] },
      },
    ],
  },

  // ✅ Profile History (For Tracking Changes)
  profileHistory: [
    {
      profileData: { type: Object }, // Stores old profile snapshot
      archivedAt: { type: Date, default: Date.now },
    },
  ],
});

// ✅ Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method to compare provided password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Archive Old Profile Before Updating
userSchema.methods.updateProfile = async function (newProfileData) {
  // Save current profile to history before updating
  if (this.profile) {
    this.profileHistory.push({ profileData: { ...this.profile }, archivedAt: new Date() });
  }
  // Update profile with new data
  this.profile = { ...newProfileData, updatedAt: new Date() };
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
