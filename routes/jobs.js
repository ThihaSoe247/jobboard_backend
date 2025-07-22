const express = require("express");
const JobController = require("../controllers/job-controller");

const router = express.Router();

// 🔍 Public job listings (for all users)
router.get("/", JobController.getAllJobs);

module.exports = router;
