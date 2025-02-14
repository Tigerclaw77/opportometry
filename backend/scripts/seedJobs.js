// scripts/seedJobs.js

const mongoose = require('mongoose');
const Job = require('../models/Job');  // Import the Job model

// Dummy job data to insert into the database
const dummyJobs = [
  {
    title: "Optometrist",
    description: "Join our growing clinic offering excellent benefits and a competitive salary.",
    corporation: "Optometrist Corp",
    company: "Optometry Solutions",
    hours: "full-time",
    role: "Optometrist",
    practiceMode: "employed",
    createdBy: null,  // You can leave this as null or use a dummy user ID if needed
    createdAt: new Date(),
    savedBy: [], // Empty array to simulate no saved users for now
  },
  {
    title: "Optometrist or Ophthalmologist",
    description: "Part-time opportunity at a well-established clinic with flexible hours.",
    corporation: "EyeCare Group",
    company: "Houston Eye Clinic",
    hours: "part-time",
    role: "Optometrist",
    practiceMode: "contract",
    createdBy: null,  // Leave as null for now
    createdAt: new Date(),
    savedBy: [],
  },
  {
    title: "Optometrist (Locum Tenens)",
    description: "Temporary locum tenens opportunity with great pay and flexible schedule.",
    corporation: "Locum Tenens Group",
    company: "Eyeworks Solutions",
    hours: "per diem",
    role: "Optometrist",
    practiceMode: "associate",
    createdBy: null,  // Leave as null or use a valid user ID
    createdAt: new Date(),
    savedBy: [],
  },
];

// Seed the dummy data into the database
const seedJobs = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await Job.insertMany(dummyJobs);  // Insert the jobs into the database
    console.log("Dummy jobs have been seeded!");
    mongoose.connection.close();  // Close the connection after seeding
  } catch (error) {
    console.error("Error seeding jobs:", error);
  }
};

// Call the function to seed data
seedJobs();
