const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register"); // Merged registration routes

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Route declarations
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/register", registerRoutes);
app.use("/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Use endpoints like /auth, /jobs, /users, etc.");
});

// Fallback route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
