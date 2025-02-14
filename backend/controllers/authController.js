const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Allowed companies and their domains (assuming you've defined this in your code earlier)
const approvedCompanies = {
  walmart: "walmart.com",
  luxottica: "luxottica.com",
  visionworks: "visionworks.com",
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    const domain = email.split("@")[1];

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if recruiter is trying to claim a restricted company
    let isCompanyVerified = false;
    if (role === "recruiter" && company && approvedCompanies[company]) {
      isCompanyVerified = domain === approvedCompanies[company]; // Auto-approve if domain matches
    }

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company,
      isCompanyVerified,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully. If you are a recruiter posting for a company, verification may be required." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Export the functions (including both register and login)
module.exports = {
  registerUser,
  loginUser, // Ensure loginUser is also exported here
  // verifyEmail,
  // forgotPassword,
};
