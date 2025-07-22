const Application = require("../models/Application");
const User = require("../models/User");

const ApplicationController = {
  applyForJob: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || user.role !== "applicant") {
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
};

module.exports = ApplicationController;
