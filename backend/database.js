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
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB; // Export the function
