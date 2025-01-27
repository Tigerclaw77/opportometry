const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs

const userSchema = new mongoose.Schema({
  userID: { type: String, default: uuidv4, unique: true }, // Unique user identifier
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // Unique and indexed for quick lookups
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ["candidate", "recruiter"], required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" }, // Track account status
  createdAt: { type: Date, default: Date.now },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare provided password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
