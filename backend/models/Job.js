// const mongoose = require("mongoose");

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   company: { type: String, required: true },
//   location: { type: String, required: true },
//   salary: { type: Number },
//   datePosted: { type: Date, default: Date.now },
// });

// const Job = mongoose.model("Job", jobSchema);

// module.exports = Job;

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  jobType: [{ type: String }], // e.g., ['Full-time', 'Part-time']
  position: { type: String }, // e.g., 'Leaseholder', 'Employee'
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Job', jobSchema);
