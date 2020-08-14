const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Auth
const auth = require("../middleware/auth");

// Controller
const tasksController = require("../controllers/tasksController");

// Make task
// api/tasks
router.post(
  "/",
  auth,
  [check("name", "El nombre es obligatorio").trim().notEmpty()],
  [check("project", "El proyecto es obligatorio").trim().notEmpty()],
  tasksController.createTask
);

// Get tasks by project
// api/tasks
router.get("/", auth, tasksController.getTasksByProject);

// Update task
// api/task
router.put("/:id", auth, tasksController.updateTask);
module.exports = router;

// Delete a task
// api/task
router.delete("/:id", auth, tasksController.deleteTask);
