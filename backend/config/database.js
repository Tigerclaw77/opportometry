// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     const dbName = mongoose.connection?.name || "(unknown)";
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`✅ Using Database: ${dbName}`);
//   } catch (error) {
//     console.error("❌ Initial MongoDB connection failed:", error);
//     setTimeout(connectDB, 5000); // Retry connection after 5 seconds
//   }
// };

// // ✅ Event listeners
// mongoose.connection.on("connected", () => {
//   console.log("✅ Mongoose connected to the database.");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("❌ Mongoose connection error:", err);
// });

// mongoose.connection.on("disconnected", () => {
//   console.warn("⚠️ Mongoose connection lost. Retrying...");
//   connectDB();
// });

// module.exports = connectDB;

// backend/config/database.js
const mongoose = require("mongoose");

function mask(uri='') {
  // redact credentials for logs
  try {
    const u = new URL(uri);
    if (u.password) u.password = "***";
    return u.toString();
  } catch { return "(invalid URI)"; }
}

async function connectDB() {
  const uri = process.env.MONGO_URI;   // <— MUST be MONGO_URI to match your .env
  if (!uri) {
    console.error("❌ MONGO_URI is missing. Check backend/.env and dotenv.config()");
    return process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected:", mask(uri));
  } catch (err) {
    console.error("❌ Initial MongoDB connection failed:", err);
    return process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
  });
}

module.exports = connectDB;
