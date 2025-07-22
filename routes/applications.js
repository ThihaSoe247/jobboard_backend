const express = require("express");
const ApplicationController = require("../controllers/application-controller");
const AuthMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

// ✅ View my applications (applicant only)
router.post("/:id/apply", AuthMiddleware, ApplicationController.applyForJob);
router.get("/my", AuthMiddleware, ApplicationController.getMyApplications);

module.exports = router;
