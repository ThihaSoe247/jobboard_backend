// controllers/recruiter-controller.js
const JobPost = require("../models/JobPost");
const User = require("../models/User");
const Application = require("../models/Application");

const RecruiterController = {
  createJob: async (req, res) => {

    try {
      const user = await User.findById(req.userId);
      if (!user || user.role !== "recruiter") {
        return res
          .status(403)
          .json({ error: "Only recruiters can post the Job!" });
      }
      const {
        title,
        description,
        company,
        location,
        type,
        salary,
        requirements,
      } = req.body;
      const job = await JobPost.create({
        title,
        description,
        company,
        location,
        type,
        salary,
        requirements,
        postedBy: req.userId,
        isApproved: false,
      });
      return res.status(201).json({ job });
    } catch (e) {
      return res.status(500).json({ error: "Failed to create job" });
    }
  },

  getMyJobs: async (req, res) => {
    try {
      const jobs = await JobPost.find({ postedBy: req.userId }).sort({
        createdAt: -1,
      });
      return res.json({ jobs });
    } catch (e) {
      return res.status(500).json({ error: "Failed to load your jobs" });
    }
  },

  updateJob: async (req, res) => {
    try {
      const job = await JobPost.findOne({
        _id: req.params.jobId,
        postedBy: req.userId,
      });
      if (!job)
        return res
          .status(403)
          .json({ error: "Not authorized or job not found" });
      const fields = [
        "title",
        "description",
        "company",
        "location",
        "type",
        "salary",
        "requirements",
      ];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) job[field] = req.body[field];
      });
      await job.save();
      return res.json({ message: "Job updated", job });
    } catch (e) {
      return res.status(500).json({ error: "Update failed" });
    }
  },

  deleteJob: async (req, res) => {
    try {
      const job = await JobPost.findById(req.params.jobId);
      if (!job) return res.status(404).json({ error: "Job not found" });
      if (job.postedBy.toString() !== req.userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this job" });
      }
      await JobPost.deleteOne({ _id: job._id });
      return res.json({ message: "Job deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: "Delete failed" });
    }
  },

  getApplicantsForJob: async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const job = await JobPost.findOne({ _id: jobId, postedBy: req.userId });
      if (!job) {
        return res.status(403).json({
          error: "You are not authorized to view this job's applicants",
        });
      }
      const applications = await Application.find({ job: jobId })
        .populate("applicant", "name email")
        .sort({ appliedAt: -1 });
      return res.json({ applications });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch applicants" });
    }
  },
};

module.exports = RecruiterController;
