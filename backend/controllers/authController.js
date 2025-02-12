const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Allowed Companies & Their Official Domains
const approvedCompanies = {
  walmart: "walmart.com",
  luxottica: "luxottica.com",
  visionworks: "visionworks.com",
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    const domain = email.split("@")[1];

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Check if recruiter is trying to claim a restricted company
    let isCompanyVerified = false;
    if (role === "recruiter" && company && approvedCompanies[company]) {
      isCompanyVerified = domain === approvedCompanies[company]; // ✅ Only auto-approve if domain matches
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company, // ✅ Store the company they are associated with
      isCompanyVerified,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully. If you are a recruiter posting for a company, verification may be required." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { registerUser };
