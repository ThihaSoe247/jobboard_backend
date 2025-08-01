const Application = require("../models/Application");
const User = require("../models/User");

const RecruiterRequest = require("../models/RecruiterRequest");
const ApplicantController = {
  updateProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, email, phone } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, phone },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }
  },
  applyForJob: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (req.userRole !== "applicant") {
        return res
          .status(403)
          .json({ error: "Only applicants can apply to jobs" });
      }
      const { resumeUrl, coverLetter } = req.body;
      const jobId = req.params.id;
      const alreadyApplied = await Application.findOne({
        job: jobId,
        applicant: req.userId,
      });

      if (alreadyApplied) {
        return res
          .status(400)
          .json({ error: "You already applied to this job" });
      }
      const application = await Application.create({
        job: jobId,
        applicant: req.userId,
        resumeUrl,
        coverLetter,
        status: "applied",
        appliedAt: new Date(),
      });

      return res.status(201).json({ application });
    } catch (e) {
      return res.status(500).json({ error: "Failed to apply" });
    }
  },
  getMyApplications: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || user.role !== "applicant") {
        return res
          .status(403)
          .json({ error: "Only applicants can view their applications" });
      }

      const applications = await Application.find({ applicant: req.userId })
        .populate("job") // populate job info
        .sort({ appliedAt: -1 });

      return res.json({ applications });
    } catch (e) {
      console.error("Get Applications Error:", e.message);
      return res.status(500).json({ error: "Failed to load applications" });
    }
  },

  // POST /api/applicant/request-recruiter
  requestRecruiter: async (req, res) => {
    try {
      const existing = await RecruiterRequest.findOne({ user: req.userId });
      if (existing) {
        return res.status(400).json({ error: "Request already submitted." });
      }

      const request = await RecruiterRequest.create({ user: req.userId });
      return res.status(201).json({ message: "Request submitted", request });
    } catch (e) {
      return res.status(500).json({ error: "Failed to submit request" });
    }
  },

  // GET /api/applicant/my-request-status
  getRequestStatus: async (req, res) => {
    try {
      const request = await RecruiterRequest.findOne({ user: req.userId });
      if (!request) {
        return res.status(404).json({ error: "No request found" });
      }

      return res.json({ status: request.status });
    } catch (e) {
      return res.status(500).json({ error: "Failed to load request status" });
    }
  },
  // GET /api/applicant/my-pending-request
  getPendingRequestStatus: async (req, res) => {
    try {
      const request = await RecruiterRequest.findOne({
        user: req.userId,
        status: "pending",
      });

      if (!request) {
        return res.status(404).json({ message: "No pending request found" });
      }

      return res.json({ request });
    } catch (e) {
      console.error("Pending request error:", e.message);
      return res.status(500).json({ error: "Failed to load pending request" });
    }
  },
};

module.exports = ApplicantController;
