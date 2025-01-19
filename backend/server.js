const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database"); // Import the database connection
const jobRoutes = require("./routes/jobs"); // Import job routes

dotenv.config(); // Load environment variables

const app = express(); // Initialize app

// Enable CORS with all origins allowed
app.use(cors({ origin: "*" }));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", jobRoutes); // Prefix for all job routes

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the API! Use /api/jobs to interact with job postings.");
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
