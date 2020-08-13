const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Auth
const auth = require("../middleware/auth");

// Controller
const projectsController = require("../controllers/projectsController");

// Create project
// api/projects
router.post(
  "/",
  auth,
  [check("name", "El nombre es obligatorio").trim().notEmpty()],
  projectsController.createProject
);

// Get all the projects from user
// api/projects
router.get("/", auth, projectsController.getProjects);

// Update project
// api/projects/:id
router.put(
  "/:id",
  auth,
  [check("name", "El nombre es obligatorio").trim().notEmpty()],
  projectsController.updateProject
);

// Delete project
// api/projects/:id
router.delete("/:id", auth, projectsController.deleteProject);

module.exports = router;
