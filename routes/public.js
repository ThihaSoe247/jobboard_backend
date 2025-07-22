const express = require("express");
const JobController = require("../controllers/job-controller");

const router = express.Router();

router.get("/jobs", JobController.getAllJobs);
router.get("/jobs/:id", JobController.getJobById);

module.exports = router;
