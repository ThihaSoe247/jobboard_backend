const express = require("express");
const ApplicantController = require("../controllers/application-controller");
const AuthMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/:id/apply", AuthMiddleware, ApplicantController.applyForJob);

router.get("/my", AuthMiddleware, ApplicantController.getMyApplications);
router.post(
  "/request-recruiter",
  AuthMiddleware,
  ApplicantController.requestRecruiter
);
router.get(
  "/my-request-status",
  AuthMiddleware,
  ApplicantController.getRequestStatus
);
router.get(
  "/my-pending-request",
  AuthMiddleware,
  ApplicantController.getPendingRequestStatus
);
router.put("/profile", AuthMiddleware, ApplicantController.updateProfile);

module.exports = router;
