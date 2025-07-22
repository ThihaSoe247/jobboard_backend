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
  "/users/:id",
  AuthMiddleware,
  isAdmin,
  AdminController.updateUserRole
);
module.exports = router;
