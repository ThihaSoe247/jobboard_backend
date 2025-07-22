const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/auth-middleware");
const RecruiterController = require("../controllers/recruiter-controller");
// 🧱 Recruiter Routes
router.post("/create", AuthMiddleware, RecruiterController.createJob);
router.get("/my", AuthMiddleware, RecruiterController.getMyJobs);
router.get(
  "/:jobId/applications",
  AuthMiddleware,
  RecruiterController.getApplicantsForJob
);
router.put("/:jobId", AuthMiddleware, RecruiterController.updateJob);
router.delete("/:jobId", AuthMiddleware, RecruiterController.deleteJob);

module.exports = router;
