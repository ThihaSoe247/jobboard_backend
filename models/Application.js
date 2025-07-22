const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["applied", "reviewed", "accepted", "rejected"],
    default: "applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
