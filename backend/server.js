// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/database");
// const jobRoutes = require("./routes/jobs");
// const userRoutes = require("./routes/users");
// const authRoutes = require("./routes/auth");
// const registerRoutes = require("./routes/register");
// const recommendationsRoutes = require("./routes/recommendations");

// dotenv.config(); // Load environment variables

// const app = express();

// // Middleware
// app.use(cors({ origin: "*" }));
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Route declarations
// app.use("/auth", authRoutes);
// app.use("/jobs", jobRoutes);
// app.use("/register", registerRoutes);
// app.use("/users", userRoutes);
// app.use("/recommendations", recommendationsRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("Welcome to the API! Use endpoints like /auth, /jobs, /users, etc.");
// });

// // Fallback route for unmatched endpoints
// app.use((req, res) => {
//   res.status(404).json({ message: "Endpoint not found" });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const jobRoutes = require('./routes/jobs');  // Import the jobs routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const recommendationsRoutes = require('./routes/recommendations');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register the routes
app.use('/api/jobs', jobRoutes);  // Prefix all job-related routes with /api/jobs
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use endpoints like /api/auth, /api/jobs, /api/users, etc.');
});

// Fallback route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
