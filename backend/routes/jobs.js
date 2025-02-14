// // const express = require("express");
// // const router = express.Router();
// // const Job = require("../models/Job");
// // const User = require("../models/User");
// // const { authenticateUser, authorizeRoles, checkJobOwnership } = require("../middleware/auth");
// // const verifyRole = require("../middleware/authMiddleware");

// // // ✅ Allowed Companies & Their Official Domains
// // const approvedCompanies = ["walmart", "luxottica", "visionworks"];

// // // ✅ Get All Job Postings (Public)
// // router.get("/", async (req, res) => {
// //   try {
// //     const { role, hours, practiceMode, corporation, company } = req.query;
// //     const query = {};

// //     if (role) query.role = role;
// //     if (hours) query.hours = hours;
// //     if (practiceMode) query.practiceMode = practiceMode;
// //     if (corporation) query.corporation = corporation;
// //     if (company) query.company = company;

// //     const jobs = await Job.find(query);
// //     res.json(jobs);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching jobs", error: error.message });
// //   }
// // });

// // // ✅ Post a New Job (Anyone Can Post, but Company Posting is Restricted)
// // router.post("/", authenticateUser, verifyRole("recruiter"), async (req, res) => {
// //   try {
// //     const { company, title, description, hours, role, practiceMode } = req.body;
// //     const user = await User.findById(req.user.id);

// //     if (!user || user.role !== "recruiter") {
// //       return res.status(403).json({ message: "Only recruiters can post jobs." });
// //     }

// //     // ✅ Restrict Posting for Approved Companies
// //     if (approvedCompanies.includes(company.toLowerCase()) && !user.isCompanyVerified) {
// //       return res.status(403).json({ message: `You are not authorized to post jobs for ${company}.` });
// //     }

// //     const job = new Job({
// //       title,
// //       description,
// //       company,
// //       hours,
// //       role,
// //       practiceMode,
// //       createdBy: user._id,
// //     });

// //     await job.save();
// //     res.status(201).json({ message: "Job posted successfully!", job });
// //   } catch (error) {
// //     res.status(400).json({ message: "Error posting job", error: error.message });
// //   }
// // });

// // // ✅ Update a Job (Only the Owner Can Edit)
// // router.put("/:jobId", authenticateUser, authorizeRoles(["recruiter", "premiumrecruiter"]), checkJobOwnership, async (req, res) => {
// //   try {
// //     const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
// //     res.json(updatedJob);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error updating job", error: error.message });
// //   }
// // });

// // // ✅ Admin: Get All Jobs (Only Admins Can Access)
// // router.get("/admin/jobs", authenticateUser, verifyRole("admin"), async (req, res) => {
// //   try {
// //     const jobs = await Job.find();
// //     res.json(jobs);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching jobs", error: error.message });
// //   }
// // });

// // // ✅ Save Job for Candidates
// // router.post("/save-job", authenticateUser, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);
// //     if (user.role !== "candidate") {
// //       return res.status(403).json({ message: "Only candidates can save jobs." });
// //     }

// //     const { jobId } = req.body;
// //     if (!user.savedJobs.includes(jobId)) {
// //       user.savedJobs.push(jobId);
// //       await user.save();
// //     }

// //     res.status(200).json({ message: "Job saved successfully!", savedJobs: user.savedJobs });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error saving job", error: error.message });
// //   }
// // });

// // // ✅ Remove Saved Job (New Feature)
// // router.delete("/remove-saved-job", authenticateUser, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);
// //     if (user.role !== "candidate") {
// //       return res.status(403).json({ message: "Only candidates can remove saved jobs." });
// //     }

// //     const { jobId } = req.body;
// //     user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
// //     await user.save();

// //     res.status(200).json({ message: "Job removed from saved list!", savedJobs: user.savedJobs });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error removing saved job", error: error.message });
// //   }
// // });

// // // ✅ Save Job Template (For High-Tier Recruiters)
// // router.post("/save-template", authenticateUser, verifyRole("recruiter"), async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);

// //     if (user.tier < 2) {
// //       return res.status(403).json({ message: "Upgrade your account to save job templates." });
// //     }

// //     user.jobTemplates.push(req.body);
// //     await user.save();

// //     res.status(201).json({ message: "Template saved!", templates: user.jobTemplates });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error saving template", error: error.message });
// //   }
// // });

// // // ✅ Get Job Templates (For High-Tier Recruiters)
// // router.get("/templates", authenticateUser, verifyRole("recruiter"), async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);

// //     if (user.tier < 2) {
// //       return res.status(403).json({ message: "Upgrade your account to access job templates." });
// //     }

// //     res.status(200).json(user.jobTemplates);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching templates", error: error.message });
// //   }
// // });

// // // ✅ Get Saved Jobs for Candidate
// // router.get("/saved", authenticateUser, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id).populate("savedJobs");
// //     if (!user || user.role !== "candidate") {
// //       return res.status(403).json({ message: "Only candidates can access saved jobs." });
// //     }
// //     res.status(200).json(user.savedJobs);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching saved jobs", error: error.message });
// //   }
// // });

// // // ✅ Recruiter: Get Saved Count for Their Jobs
// // router.get("/saved-count", authenticateUser, verifyRole("recruiter"), async (req, res) => {
// //   try {
// //     const recruiterJobs = await Job.find({ createdBy: req.user.id });

// //     const jobStats = await Promise.all(
// //       recruiterJobs.map(async (job) => {
// //         const savedCount = await User.countDocuments({ savedJobs: job._id });
// //         return { jobTitle: job.title, company: job.company, savedCount };
// //       })
// //     );

// //     res.status(200).json(jobStats);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching job stats", error: error.message });
// //   }
// // });

// // const express = require('express');
// // const dotenv = require('dotenv');
// // const cors = require('cors');
// // const connectDB = require('./config/database');
// // const jobRoutes = require('./routes/jobs');  // Import the jobs routes

// // dotenv.config();

// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Connect to MongoDB
// // connectDB();

// // // Register the jobs routes
// // app.use('/api/jobs', jobRoutes);  // This will make the route available at /api/jobs

// // // Default route (optional)
// // app.get('/', (req, res) => {
// //   res.send('Welcome to the Job API!');
// // });

// // // Fallback route (optional)
// // app.use((req, res) => {
// //   res.status(404).json({ message: "Endpoint not found" });
// // });

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// // // Route to seed dummy jobs (for development only)
// // router.post("/seed", async (req, res) => {
// //   try {
// //     const dummyJobs = [
// //       {
// //         title: "Optometrist",
// //         description: "Join our growing clinic offering excellent benefits and a competitive salary.",
// //         corporation: "Optometrist Corp",
// //         company: "Optometry Solutions",
// //         hours: "full-time",
// //         role: "Optometrist",
// //         practiceMode: "employed",
// //         createdBy: "someUserId", // Replace with a valid user ID from your database
// //         createdAt: new Date(),
// //         savedBy: [],
// //       },
// //       {
// //         title: "Optometrist or Ophthalmologist",
// //         description: "Part-time opportunity at a well-established clinic with flexible hours.",
// //         corporation: "EyeCare Group",
// //         company: "Houston Eye Clinic",
// //         hours: "part-time",
// //         role: "Optometrist",
// //         practiceMode: "contract",
// //         createdBy: "anotherUserId", // Replace with a valid user ID from your database
// //         createdAt: new Date(),
// //         savedBy: [],
// //       }
// //       // Add more jobs if needed
// //     ];

// //     // Seed jobs into the database
// //     await Job.insertMany(dummyJobs);
// //     res.status(201).json({ message: "Dummy jobs seeded successfully!" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error seeding jobs", error: error.message });
// //   }
// // });

// const express = require('express');
// const router = express.Router();
// const Job = require('../models/Job');
// const User = require('../models/User');
// const { authenticateUser, authorizeRoles, checkJobOwnership } = require('../middleware/auth');
// const verifyRole = require('../middleware/authMiddleware');

// // ✅ Allowed Companies & Their Official Domains
// const approvedCompanies = ['walmart', 'luxottica', 'visionworks'];

// // ✅ Get All Job Postings (Public)
// router.get('/', async (req, res) => {
//   try {
//     const { role, hours, practiceMode, corporation, company } = req.query;
//     const query = {};

//     if (role) query.role = role;
//     if (hours) query.hours = hours;
//     if (practiceMode) query.practiceMode = practiceMode;
//     if (corporation) query.corporation = corporation;
//     if (company) query.company = company;

//     const jobs = await Job.find(query);
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching jobs', error: error.message });
//   }
// });

// // ✅ Post a New Job (Anyone Can Post, but Company Posting is Restricted)
// router.post('/', authenticateUser, verifyRole('recruiter'), async (req, res) => {
//   try {
//     const { company, title, description, hours, role, practiceMode } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user || user.role !== 'recruiter') {
//       return res.status(403).json({ message: 'Only recruiters can post jobs.' });
//     }

//     // ✅ Restrict Posting for Approved Companies
//     if (approvedCompanies.includes(company.toLowerCase()) && !user.isCompanyVerified) {
//       return res.status(403).json({ message: `You are not authorized to post jobs for ${company}.` });
//     }

//     const job = new Job({
//       title,
//       description,
//       company,
//       hours,
//       role,
//       practiceMode,
//       createdBy: user._id,
//     });

//     await job.save();
//     res.status(201).json({ message: 'Job posted successfully!', job });
//   } catch (error) {
//     res.status(400).json({ message: 'Error posting job', error: error.message });
//   }
// });

// // ✅ Seed Jobs (For Development Only)
// router.post('/seed', async (req, res) => {
//   try {
//     const dummyJobs = [
//       {
//         title: 'Optometrist',
//         description: 'Join our growing clinic offering excellent benefits and a competitive salary.',
//         corporation: 'Optometrist Corp',
//         company: 'Optometry Solutions',
//         hours: 'full-time',
//         role: 'Optometrist',
//         practiceMode: 'employed',
//         createdBy: 'someUserId',  // Replace with a valid user ID
//         createdAt: new Date(),
//         savedBy: [],
//       },
//       {
//         title: 'Optometrist or Ophthalmologist',
//         description: 'Part-time opportunity at a well-established clinic with flexible hours.',
//         corporation: 'EyeCare Group',
//         company: 'Houston Eye Clinic',
//         hours: 'part-time',
//         role: 'Optometrist',
//         practiceMode: 'contract',
//         createdBy: 'anotherUserId',  // Replace with a valid user ID
//         createdAt: new Date(),
//         savedBy: [],
//       }
//     ];

//     await Job.insertMany(dummyJobs);
//     res.status(201).json({ message: 'Dummy jobs seeded successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error seeding jobs', error: error.message });
//   }
// });

// // ✅ Update a Job (Only the Owner Can Edit)
// router.put('/:jobId', authenticateUser, authorizeRoles(['recruiter', 'premiumrecruiter']), checkJobOwnership, async (req, res) => {
//   try {
//     const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
//     res.json(updatedJob);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating job', error: error.message });
//   }
// });

// // Other routes...

// module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles, checkJobOwnership } = require('../middleware/auth');
const verifyRole = require('../middleware/authMiddleware');

// ✅ Allowed Companies & Their Official Domains
const approvedCompanies = ['walmart', 'luxottica', 'visionworks'];

// Static jobs data (Hardcoded for now)
const staticJobs = [
  {
    _id: '1',
    title: 'Optometrist',
    description: 'Join our growing clinic offering excellent benefits and a competitive salary.',
    corporation: 'Optometrist Corp',
    company: 'Optometry Solutions',
    hours: 'full-time',
    role: 'Optometrist',
    practiceMode: 'employed',
    createdBy: 'someUserId', // Placeholder ID
    createdAt: new Date(),
    savedBy: [],
  },
  {
    _id: '2',
    title: 'Optometrist or Ophthalmologist',
    description: 'Part-time opportunity at a well-established clinic with flexible hours.',
    corporation: 'EyeCare Group',
    company: 'Houston Eye Clinic',
    hours: 'part-time',
    role: 'Optometrist',
    practiceMode: 'contract',
    createdBy: 'anotherUserId', // Placeholder ID
    createdAt: new Date(),
    savedBy: [],
  },
  // You can add more jobs here
];

// ✅ Get All Job Postings (Public)
router.get('/', async (req, res) => {
  try {
    const { role, hours, practiceMode, corporation, company } = req.query;
    let filteredJobs = [...staticJobs];  // Copy the static jobs array

    // Filter jobs based on query params
    if (role) filteredJobs = filteredJobs.filter(job => job.role === role);
    if (hours) filteredJobs = filteredJobs.filter(job => job.hours === hours);
    if (practiceMode) filteredJobs = filteredJobs.filter(job => job.practiceMode === practiceMode);
    if (corporation) filteredJobs = filteredJobs.filter(job => job.corporation === corporation);
    if (company) filteredJobs = filteredJobs.filter(job => job.company === company);

    res.json(filteredJobs);  // Return filtered jobs
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// ✅ Post a New Job (Anyone Can Post, but Company Posting is Restricted)
router.post('/', authenticateUser, verifyRole('recruiter'), async (req, res) => {
  try {
    const { company, title, description, hours, role, practiceMode } = req.body;

    // Check if user is a recruiter (this is hardcoded logic)
    const user = { role: 'recruiter', isCompanyVerified: true, _id: 'recruiterUserId' };  // Simulated user data

    if (!user || user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs.' });
    }

    // ✅ Restrict Posting for Approved Companies
    if (approvedCompanies.includes(company.toLowerCase()) && !user.isCompanyVerified) {
      return res.status(403).json({ message: `You are not authorized to post jobs for ${company}.` });
    }

    const newJob = {
      _id: (staticJobs.length + 1).toString(), // Increment job ID
      title,
      description,
      company,
      hours,
      role,
      practiceMode,
      createdBy: user._id,
      createdAt: new Date(),
      savedBy: [],
    };

    staticJobs.push(newJob); // Add the new job to staticJobs array
    res.status(201).json({ message: 'Job posted successfully!', job: newJob });
  } catch (error) {
    res.status(400).json({ message: 'Error posting job', error: error.message });
  }
});

// ✅ Seed Jobs (For Development Only)
router.post('/seed', async (req, res) => {
  try {
    // Seed staticJobs array with predefined jobs (Already defined above)
    if (staticJobs.length > 0) {
      return res.status(400).json({ message: 'Jobs are already seeded.' });
    }

    const dummyJobs = [
      {
        _id: '1',
        title: 'Optometrist',
        description: 'Join our growing clinic offering excellent benefits and a competitive salary.',
        corporation: 'Optometrist Corp',
        company: 'Optometry Solutions',
        hours: 'full-time',
        role: 'Optometrist',
        practiceMode: 'employed',
        createdBy: 'someUserId', // Placeholder ID
        createdAt: new Date(),
        savedBy: [],
      },
      {
        _id: '2',
        title: 'Optometrist or Ophthalmologist',
        description: 'Part-time opportunity at a well-established clinic with flexible hours.',
        corporation: 'EyeCare Group',
        company: 'Houston Eye Clinic',
        hours: 'part-time',
        role: 'Optometrist',
        practiceMode: 'contract',
        createdBy: 'anotherUserId', // Placeholder ID
        createdAt: new Date(),
        savedBy: [],
      },
    ];

    staticJobs.push(...dummyJobs);  // Add the dummy jobs to the staticJobs array
    res.status(201).json({ message: 'Dummy jobs seeded successfully!', jobs: dummyJobs });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding jobs', error: error.message });
  }
});

// ✅ Update a Job (Only the Owner Can Edit)
router.put('/:jobId', authenticateUser, authorizeRoles(['recruiter', 'premiumrecruiter']), checkJobOwnership, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updatedJobData = req.body;

    // Find the job in the staticJobs array by ID
    const jobIndex = staticJobs.findIndex(job => job._id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = { ...staticJobs[jobIndex], ...updatedJobData, updatedAt: new Date() };
    staticJobs[jobIndex] = updatedJob;  // Update the job in the static array

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

// Other routes...

module.exports = router;
