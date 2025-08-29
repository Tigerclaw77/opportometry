const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const connectDB = require('./config/database');
const cron = require('node-cron');
const { billJobsMonthly } = require('./controllers/billingController'); // ✅ Billing engine

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Route imports
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recommendationsRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const billingRoutes = require("./routes/billingRoutes");

// Register the routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/billing", billingRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use endpoints like /api/auth, /api/jobs, /api/users, etc.');
});

// 404 Handler (should always be last)
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// ✅ Cron: Run billing daily at 3:00am
cron.schedule("0 3 * * *", async () => {
  try {
    console.log("🧾 Running daily job billing engine...");
    await billJobsMonthly({ body: {}, user: { userRole: "admin" } }, { // mock req/res
      status: () => ({
        json: (msg) => console.log("✅ Billing engine:", msg),
      }),
    });
  } catch (err) {
    console.error("❌ Billing cron error:", err);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
