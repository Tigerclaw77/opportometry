const mongoose = require("mongoose");

// const uri =
//   "mongodb+srv://pauldriggers:Mc4e5mkGs0ewici8@cluster0.dvz3n.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Initial MongoDB connection failed:", error);

    // Retry mechanism
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Event listeners for mongoose connection
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database.");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose connection lost. Retrying...");
  connectDB(); // Automatically retry if disconnected
});

module.exports = connectDB;
