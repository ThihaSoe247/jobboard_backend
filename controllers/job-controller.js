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

// const JobController = {
//   getAllJobs: async (req, res) => {
//     try {
//       const { keyword, location, type } = req.query;

//       console.log("Query received:", req.query);

//       let query = { isApproved: true };

//       if (keyword) query.title = { $regex: keyword, $options: "i" };
//       if (location) query.location = { $regex: location, $options: "i" };
//       if (type) query.type = type;

//       console.log("Final query:", query);

//       const jobs = await JobPost.find(query).sort({ createdAt: -1 });

//       return res.json({ jobs });
//     } catch (e) {
//       console.error("ERROR in getAllJobs:", e);
//       return res.status(500).json({ error: "Failed to load jobs" });
//     }
//   },
//   createJob: async (req, res) => {
//     try {
//       const user = await User.findById(req.userId);
//       if (!user || user.role != "recruiter") {
//         return res.status(403).json({
//           error: "Only recruiters can post the Job!",
//         });
//       }

//       const {
//         title,
//         description,
//         company,
//         location,
//         type,
//         salary,
//         requirements,
//       } = req.body;

//       const job = await JobPost.create({
//         title,
//         description,
//         company,
//         location,
//         type,
//         salary,
//         requirements,
//         postedBy: req.userId,
//         isApproved: false,
//       });
//       return res.status(201).json({
//         job,
//       });
//     } catch (e) {
//       return res.status(500).json({ error: "Failed to create job" });
//     }
//   },
//   getMyJobs: async (req, res) => {
//     try {
//       const jobs = await JobPost.find({ postedBy: req.userId }).sort({
//         createdAt: -1,
//       });
//       return res.json({ jobs });
//     } catch (e) {
//       console.error("Get My Jobs Error:", e.message);
//       return res.status(500).json({ error: "Failed to load your jobs" });
//     }
//   },
//   getApplicantsForJob: async (req, res) => {
//     try {
//       const jobId = await req.params.jobId;
//       const job = await JobPost.findById({ _id: jobId, postedBy: req.userId });
//       if (!job) {
//         return res.status(403).json({
//           error: "You are not authorized to view this job's applicants",
//         });
//       }
//       const applications = await Application.find({ job: jobId })
//         .populate("applicant", "name email")
//         .sort({ appliedAt: -1 });
//       return res.json({ applications });
//     } catch (err) {
//       console.error("Get applicants error:", err.message);
//       return res.status(500).json({ error: "Failed to fetch applicants" });
//     }
//   },
//   updateJob: async (req, res) => {
//     try {
//       const job = await JobPost.findOne({
//         _id: req.params.jobId,
//         postedBy: req.userId,
//       });
//       if (!job) {
//         return res
//           .status(403)
//           .json({ error: "Not authorized or job not found" });
//       }

//       const fields = [
//         "title",
//         "description",
//         "company",
//         "location",
//         "type",
//         "salary",
//         "requirements",
//       ];

//       fields.forEach((field) => {
//         if (req.body[field] !== undefined) job[field] = req.body[field];
//       });

//       await job.save();
//       return res.json({ message: "Job updated", job });
//     } catch (e) {
//       return res.status(500).json({ error: "Update failed" });
//     }
//   },
//   deleteJob: async (req, res) => {
//     try {
//       const job = await JobPost.findById(req.params.jobId);

//       if (!job) {
//         return res.status(404).json({ error: "Job not found" });
//       }

//       if (job.postedBy.toString() !== req.userId) {
//         return res
//           .status(403)
//           .json({ error: "Not authorized to delete this job" });
//       }

//       await JobPost.deleteOne({ _id: job._id });

//       return res.json({ message: "Job deleted successfully" });
//     } catch (e) {
//       console.error("Delete error:", e.message);
//       return res.status(500).json({ error: "Delete failed" });
//     }
//   },
//   // GET /api/admin/jobs
//   getAllJobsForAdmin: async (req, res) => {
//     try {
//       const jobs = await JobPost.find().populate("postedBy", "name email role");
//       res.json({ jobs });
//     } catch (e) {
//       res.status(500).json({ error: "Failed to fetch jobs" });
//     }
//   },

//   approveJob: async (req, res) => {
//     try {
//       const job = await JobPost.findByIdAndUpdate(
//         req.params.id,
//         { isApproved: true },
//         { new: true }
//       );

//       if (!job) {
//         return res.status(404).json({
//           error: "Job not found",
//         });
//       }

//       return res.status(200).json({
//         message: "Job approved successfully",
//         job,
//       });
//     } catch (e) {
//       console.error("Approve Job Error:", e);
//       return res.status(500).json({
//         error: "Failed to approve job",
//       });
//     }
//   },

//   adminDeleteJob: (req, res) => {
//     try {
//       const jobId = req.params.id;
//       const job = JobPost.findByIdAndDelete(jobId);
//       if (!job) {
//         return res.status(404).json({ error: "Job not found" });
//       }
//       return res.json({ message: "Job deleted by admin" });
//     } catch (e) {
//       return res.json(500).json({ error: "Failed to delete Job" });
//     }
//   },

//   viewAllUsers: (req, res) => {

//   },
// };

// module.exports = JobController;
