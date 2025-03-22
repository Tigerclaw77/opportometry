// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");

// // Allowed companies and their domains
// const approvedCompanies = {
//   walmart: "walmart.com",
//   luxottica: "luxottica.com",
//   visionworks: "visionworks.com",
// };

// // Register a new user
// const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, confirmPassword, role, recruiterType } = req.body;

//     // Validate required fields
//     if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Validate password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match." });
//     }

//     // Validate password strength (at least 8 chars, one number, one special char)
//     const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one number and one special character." });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Corporate Recruiter Handling
//     let corporation = null;
//     let isCompanyVerified = false;

//     if (role === "recruiter" && recruiterType === "corporate") {
//       const domain = email.split("@")[1];
//       for (const company in approvedCompanies) {
//         if (domain === approvedCompanies[company]) {
//           corporation = company;
//           isCompanyVerified = true;
//           break;
//         }
//       }

//       if (!corporation) {
//         return res.status(400).json({ message: "Corporate recruiters must use an approved company email." });
//       }
//     }

//     // Create new user
//     const user = new User({
//       userID: uuidv4(), // Generate a unique user ID
//       email,
//       password: hashedPassword,
//       role,
//       createdAt: new Date(),
//       profile: { firstName, lastName },
//       recruiterInfo: {
//         recruiterType: recruiterType || "independent",
//         corporation,
//       },
//     });

//     await user.save();

//     res.status(201).json({ 
//       message: "User registered successfully! If you are a corporate recruiter, verification may be required.",
//       userID: user.userID,
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found." });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "Login successful.", token });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Export the functions
// module.exports = {
//   registerUser,
//   loginUser,
// };

const User = require("../models/User");
const crypto = require("crypto"); // ✅ For generating unique verification tokens
const nodemailer = require("nodemailer"); // ✅ For sending verification emails

// ✅ Set up Nodemailer (Replace with your email credentials)
// const transporter = nodemailer.createTransport({
//   service: "gmail", // ✅ Change if using another provider
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("🚨 Nodemailer Setup Error:", error);
//   } else {
//     console.log("✅ Nodemailer is ready to send emails");
//   }
// });

// ✅ Create a test account with Ethereal
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error("🚨 Failed to create test account:", err);
    return;
  }

  // ✅ Use Ethereal SMTP server for testing
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   auth: {
  //     user: account.user, // ✅ Ethereal test user
  //     pass: account.pass, // ✅ Ethereal test password
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.aol.com", // ✅ AOL's SMTP Server
    port: 465, // ✅ Secure port for AOL
    secure: true, // ✅ Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.error("🚨 AOL Email Setup Error:", error);
    } else {
      console.log("✅ AOL Email is ready to send emails");
    }
  });

  // ✅ Define email details
  // const mailOptions = {
  //   from: '"Opportometry Test" <test@opportometry.com>',
  //   to: "test@example.com", // ✅ This won't send a real email, just a test log
  //   subject: "Test Email from Opportometry",
  //   text: "This is a test email sent using Ethereal!",
  // };

  const mailOptions = {
    from: `"Opportometry" <${process.env.EMAIL_USER}>`, // ✅ Must match AOL email exactly
    to: email, // ✅ Send to the registered user
    subject: "Verify Your Email",
    html: `
      <p>Welcome to Opportometry, ${firstName}!</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="http://localhost:3000/verify-email?token=${verificationToken}" target="_blank">Verify My Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };
  

  // ✅ Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("🚨 Error sending test email:", error);
    } else {
      console.log("✅ Test email sent successfully! View it at:", nodemailer.getTestMessageUrl(info));
    }
  });
});

// ✅ Register User & Send Verification Email
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ✅ Create new user (Not verified yet)
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken,
      profile: { firstName, lastName, updatedAt: new Date() },
    });

    await newUser.save();

    // ✅ Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: "Registration successful! Check your email to verify your account." });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Verify Email Token & Activate Account
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // ✅ Find user with the verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: "Invalid or expired verification link." });

    // ✅ Mark user as verified
    user.isVerified = true;
    user.verificationToken = null; // ✅ Remove token after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Prevent Unverified Users from Logging In
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // ✅ Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // ✅ Prevent login if email is not verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful.", token });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, verifyEmail };
