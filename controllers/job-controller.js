const JobPost = require("../models/JobPost");
const User = require("../models/User");
const Application = require("../models/Application");

const JobController = {
  getAllJobs: async (req, res) => {
    try {
      const { keyword, location, type } = req.query;
      let query = { isApproved: true };
      if (keyword) query.title = { $regex: keyword, $options: "i" };
      if (location) query.location = { $regex: location, $options: "i" };
      if (type) query.type = type;
      const jobs = await JobPost.find(query).sort({ createdAt: -1 });
      return res.json({ jobs });
    } catch (e) {
      return res.status(500).json({ error: "Failed to load jobs" });
    }
  },

  getJobById: async (req, res) => {
    try {
      const job = await JobPost.findOne({
        _id: req.params.id,
        isApproved: true,
      }).populate("postedBy", "name email");

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      return res.json({ job });
    } catch (e) {
      console.error("Error fetching job by ID:", e.message);
      return res.status(500).json({ error: "Failed to fetch job" });
    }
  },
};

module.exports = JobController;
