const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    const dbName = mongoose.connection?.name || "(unknown)";
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Using Database: ${dbName}`);
  } catch (error) {
    console.error("❌ Initial MongoDB connection failed:", error);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// ✅ Event listeners
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to the database.");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose connection lost. Retrying...");
  connectDB();
});

module.exports = connectDB;
