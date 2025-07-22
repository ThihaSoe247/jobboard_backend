// controllers/admin-controller.js
const JobPost = require("../models/JobPost");
const User = require("../models/User");

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
};

module.exports = AdminController;
