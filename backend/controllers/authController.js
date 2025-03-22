const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.aol.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * ✅ Register User
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userRole } = req.body;

    // ✅ Basic Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required.",
      });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ✅ Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      userRole,
      isVerified: false,
      verificationToken,
      profile: {
        firstName,
        lastName,
        updatedAt: new Date(),
      },
    });

    await newUser.save();

    console.log("✅ User registered successfully:", newUser.email);

    // ✅ Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Opportometry" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <p>Welcome to Opportometry, ${firstName}!</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify My Email</a>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    });

    return res.status(201).json({
      message: "User registered successfully! Check your email for verification.",
    });
  } catch (error) {
    console.error("🚨 Registration Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

/**
 * ✅ Login User
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({
        fieldErrors: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        fieldErrors: { email: "Invalid email/password combination." },
        message: "Invalid email/password combination.",
      });
    }
    console.log("✅ User hashed password:", user.password);
    console.log("✅ Password from login form:", password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`🚨 Invalid password attempt for ${user.email}`);

      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();

      const remainingAttempts = 5 - user.failedLoginAttempts;

      if (remainingAttempts <= 0) {
        return res.status(429).json({
          message: "Too many failed login attempts. Try again later.",
        });
      }

      return res.status(400).json({
        fieldErrors: {
          password: `Invalid email/password combination. ${remainingAttempts} attempts remaining.`,
        },
        message: `Invalid email/password combination. ${remainingAttempts} attempts remaining.`,
      });
    }

    // ✅ Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    // ✅ Reset failed login attempts after successful login
    user.failedLoginAttempts = 0;
    await user.save();

    // ✅ Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Define redirect route
    let dashboardRoute = "/";
    if (user.userRole === "admin") dashboardRoute = "/admin";
    else if (user.userRole === "recruiter") dashboardRoute = "/recruiter/dashboard";
    else if (user.userRole === "candidate") dashboardRoute = "/candidate/dashboard";

    console.log(`✅ ${user.email} logged in as ${user.userRole}`);

    return res.status(200).json({
      message: "Login successful.",
      token,
      userRole: user.userRole,
      redirect: dashboardRoute,
    });
  } catch (error) {
    console.error("🚨 Login Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

/**
 * ✅ Forgot Password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`🚨 No account associated with email: ${email}`);
      return res.status(200).json({ message: "If an account exists, a reset link will be sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log(`📩 Sending reset email to: ${email}`);

    await transporter.sendMail({
      from: `"Opportometry" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>
      `,
    });

    console.log(`✅ Password reset email sent to ${email}`);
    return res.status(200).json({ message: "If an account exists, a reset link will be sent." });
  } catch (error) {
    console.error("🚨 Forgot Password Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ✅ Reset Password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    // ✅ Find the user by the reset token
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    // ✅ Compare timestamps properly
    if (user.resetTokenExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Expired reset token." });
    }

    // ✅ Assign new password - your pre-save middleware will hash it
    user.password = newPassword;

    // ✅ Clear the reset token and expiration
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);
    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
    
  } catch (error) {
    console.error("🚨 Reset Password Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Export Controllers
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
