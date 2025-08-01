// controllers/admin-controller.js
const JobPost = require("../models/JobPost");
const User = require("../models/User");
const RecruiterRequest = require("../models/RecruiterRequest");
const AdminController = {
  getAllJobsForAdmin: async (req, res) => {
    try {
      const jobs = await JobPost.find().populate("postedBy", "name email role");
      return res.json({ jobs });
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch jobs" });
    }
  },

  approveJob: async (req, res) => {
    try {
      const job = await JobPost.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );
      if (!job) return res.status(404).json({ error: "Job not found" });
      return res
        .status(200)
        .json({ message: "Job approved successfully", job });
    } catch (e) {
      return res.status(500).json({ error: "Failed to approve job" });
    }
  },

  adminDeleteJob: async (req, res) => {
    try {
      const job = await JobPost.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ error: "Job not found" });
      return res.json({ message: "Job deleted by admin" });
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete Job" });
    }
  },

  unapproveJob: async (req, res) => {
    try {
      const job = await JobPost.findByIdAndUpdate(
        req.params.id,
        { isApproved: false },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      return res.status(200).json({
        message: "Job unapproved successfully",
        job,
      });
    } catch (e) {
      console.error("Unapprove Job Error:", e);
      return res.status(500).json({ error: "Failed to unapprove job" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      return res.json({ users });
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      const allowedRoles = ["applicant", "recruiter", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ message: "User role updated", user });
    } catch (e) {
      return res.status(500).json({ error: "Failed to update user role" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ message: "User deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  },

  getAllRecruiterRequests: async (req, res) => {
    try {
      const { status } = req.query;

      let filter = {};
      if (status) {
        filter.status = status;
      }

      const requests = await RecruiterRequest.find(filter)
        .populate("user", "name email role")
        .sort({ createdAt: -1 });

      return res.json({ requests });
    } catch (e) {
      console.error("Recruiter Requests Error:", e.message);
      return res.status(500).json({ error: "Failed to load requests" });
    }
  },
  approveRecruiterRequest: async (req, res) => {
    try {
      const request = await RecruiterRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: "Request not found" });

      const updatedUser = await User.findByIdAndUpdate(
        request.user,
        { role: "recruiter" },
        { new: true }
      );

      request.status = "approved";
      request.reviewedAt = new Date();
      await request.save();

      res.json({ message: "Request approved successfully" });
    } catch (e) {
      res.status(500).json({ error: "Approval failed" });
    }
  },

  rejectRecruiterRequest: async (req, res) => {
    try {
      const request = await RecruiterRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: "Request not found" });

      request.status = "rejected";
      request.reviewedAt = new Date();
      await request.save();

      res.json({ message: "Request rejected successfully" });
    } catch (e) {
      res.status(500).json({ error: "Rejection failed" });
    }
  },
};

module.exports = AdminController;
