const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const candidateRegister = require("./routes/candidateRegister");
const recruiterRegister = require("./routes/recruiterRegister");
const authRoutes = require("./routes/auth"); // Path to your auth route file

dotenv.config(); // Load environment variables

const app = express(); // Initialize app

// Enable CORS with all origins allowed
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/auth", require("./routes/auth"));

// Connect to MongoDB
connectDB();

app.use("/", jobRoutes);

app.use("/auth", authRoutes);

app.use("/register/candidate", candidateRegister);
app.use("/register/recruiter", recruiterRegister);

// Use the user routes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API! Use /jobs to interact with job postings.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
