const Job = require("../models/Job");
const User = require("../models/User");

// ✅ Post a Job (Recruiters Only)
const postJob = async (req, res) => {
  try {
    const { company, title, description, hours, role, practiceMode } = req.body;
    const user = await User.findById(req.user.id);

    if (user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs." });
    }
    if (!corporationData[user.corporation].includes(company)) {
      return res.status(403).json({ message: "You can only post jobs for your assigned corporation." });
    }

    const newJob = new Job({
      title,
      description,
      corporation: user.corporation,
      company,
      hours,
      role,
      practiceMode,
      createdBy: user._id,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Search Jobs
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
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Save Job Template (For High-Tier Recruiters)
const saveJobTemplate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.tier < 2) {
      return res.status(403).json({ message: "Upgrade your account to save job templates." });
    }

    user.jobTemplates.push(req.body);
    await user.save();

    res.status(201).json({ message: "Template saved!", templates: user.jobTemplates });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { postJob, searchJobs, saveJobTemplate };
