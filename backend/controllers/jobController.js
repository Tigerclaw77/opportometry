const Job = require("../models/Job");
const User = require("../models/User");

// ✅ Helper: Corporation to Company mapping (temporary in-controller)
const corporationData = {
  luxottica: ["LensCrafters", "Pearle Vision", "Target Optical"],
  walmart: ["Walmart Vision Center"],
  visionworks: ["Visionworks"],
};

// ✅ POST a Job (Recruiters Only)
const postJob = async (req, res) => {
  try {
    const { company, title, description, hours, role, practiceMode } = req.body;
    const user = await User.findById(req.user.id);

    if (user.userRole !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs." });
    }

    if (user.recruiterType === "corporate" && !corporationData[user.corporation]?.includes(company)) {
      return res.status(403).json({ message: "You can only post jobs for your assigned corporation." });
    }

    const newJob = new Job({
      title,
      description,
      company,
      corporation: user.recruiterType === "corporate" ? user.corporation : null,
      hours,
      role,
      practiceMode,
      createdBy: user._id,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!", job: newJob });

  } catch (error) {
    console.error("❌ Error posting job:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ GET /search Jobs
const searchJobs = async (req, res) => {
  try {
    const { role, hours, practiceMode, corporation, company } = req.query;
    const query = {};

    if (role) query.role = role;
    if (hours) query.hours = hours;
    if (practiceMode) query.practiceMode = practiceMode;
    if (corporation) query.corporation = corporation;
    if (company) query.company = company;

    const jobs = await Job.find(query);
    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Error searching jobs:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ POST /seed Jobs (Admins Only)
const seedJobs = async (req, res) => {
  try {
    const existingJobs = await Job.find();
    if (existingJobs.length > 0) {
      return res.status(400).json({ message: "Jobs are already seeded." });
    }

    const dummyJobs = [
      {
        title: "Optometrist",
        description: "Full-time optometrist position with great benefits.",
        corporation: "luxottica",
        company: "LensCrafters",
        hours: "full-time",
        role: "Optometrist",
        practiceMode: "employed",
        createdBy: req.user.id,
      },
      {
        title: "Ophthalmologist",
        description: "Part-time ophthalmologist needed for surgical consults.",
        corporation: "visionworks",
        company: "Visionworks",
        hours: "part-time",
        role: "Ophthalmologist",
        practiceMode: "contract",
        createdBy: req.user.id,
      },
    ];

    await Job.insertMany(dummyJobs);
    res.status(201).json({ message: "Dummy jobs seeded successfully!", jobs: dummyJobs });
  } catch (error) {
    console.error("❌ Error seeding jobs:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ PUT /:jobId Update a Job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updatedJobData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedJobData, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully.", job: updatedJob });
  } catch (error) {
    console.error("❌ Error updating job:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ DELETE /:jobId Delete a Job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting job:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Optional: Save Job Template (High-Tier Recruiters)
const saveJobTemplate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.tier < 2) {
      return res.status(403).json({ message: "Upgrade your account to save job templates." });
    }

    user.jobTemplates.push(req.body);
    await user.save();

    res.status(201).json({
      message: "Template saved!",
      templates: user.jobTemplates,
    });
  } catch (error) {
    console.error("❌ Error saving job template:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const userRole = req.user.role;

    console.log("Requester:", { recruiterId, userRole });

    // ✅ Admin gets ALL jobs, recruiters get their own
    const filter = userRole === "admin"
      ? {}
      : { createdBy: recruiterId };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ message: "Failed to fetch recruiter jobs." });
  }
};



module.exports = {
  postJob,
  searchJobs,
  seedJobs,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  saveJobTemplate, // Optional, depending on your routing
};
