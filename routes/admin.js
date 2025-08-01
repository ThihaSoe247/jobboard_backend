const express = require("express");
const AuthMiddleware = require("../middleware/auth-middleware");
const isAdmin = require("../middleware/is-admin");
const JobController = require("../controllers/job-controller");
const AdminController = require("../controllers/admin-controller");
const router = express.Router();

router.get(
  "/jobs",
  AuthMiddleware,
  isAdmin,
  AdminController.getAllJobsForAdmin
);

router.put(
  "/jobs/approve/:id",
  AuthMiddleware,
  isAdmin,
  AdminController.approveJob
);

router.delete("/jobs/delete/:id", AdminController.adminDeleteJob);

router.put(
  "/jobs/unapprove/:id",
  AuthMiddleware,
  isAdmin,
  AdminController.unapproveJob
);

router.get("/users", AuthMiddleware, isAdmin, AdminController.getAllUsers);

router.delete(
  "/users/:id",
  AuthMiddleware,
  isAdmin,
  AdminController.deleteUser
);

router.put(
  "/users/:id/role",
  AuthMiddleware,
  isAdmin,
  AdminController.updateUserRole
);

router.get(
  "/recruiter-requests",
  AuthMiddleware,
  isAdmin,
  AdminController.getAllRecruiterRequests
);

router.put(
  "/recruiter-requests/:id/approve",
  AuthMiddleware,
  isAdmin,
  AdminController.approveRecruiterRequest
);

router.put(
  "/recruiter-requests/:id/reject",
  AuthMiddleware,
  isAdmin,
  AdminController.rejectRecruiterRequest
);

module.exports = router;
