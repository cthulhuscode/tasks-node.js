const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// Crear tarea
exports.createTask = async (req, res) => {
  // No errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Error al crear tarea", errors: errors.array() });
  }

  try {
    // Extract project and check existence
    const projectId = req.body.project;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Check if the author project is the same to the authenticated user
    if (req.user.id.toString() !== project.author.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Make task
    const task = Task(req.body);
    await task.save();

    res.status(201).json({ msg: "Tarea creada correctamente", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
  try {
    // Extract project and check existence
    const projectId = req.query.project;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Check if the author project is the same to the authenticated user
    if (req.user.id.toString() !== project.author.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Get tasks by project
    const tasks = await Task.find({ project }).sort({ createdAt: -1 });
    res.status(200).json({ msg: "Tareas encontradas", tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const projectId = req.body.project;
    const taskId = req.params.id;

    // Exists task
    const task = Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    // Extract project
    const project = await Project.findById(projectId);

    // Check if the author project is the same to the authenticated user
    if (req.user.id.toString() !== project.author.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const editingTask = { ...req.body };

    await Task.findOneAndUpdate(
      { _id: taskId },
      editingTask,
      { new: true },
      (err, task) => {
        if (!err)
          res.status(200).json({ msg: "Tarea editada correctamente", task });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Check id
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        msg: "Es necesario incluir el id del proyecto",
        errors: errors.array(),
      });
    }

    // Exists task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    // Extract project
    const project = await Project.findById(task.project);

    // Check if the author project is the same to the authenticated user
    if (req.user.id.toString() !== project.author.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Delete project
    await Task.findOneAndRemove({ _id: task.id }, (err) => {
      if (err) {
        console.log(error);
        return res.status(500).json({ msg: "Error al eliminar" });
      }
      res.status(200).json({ msg: "Tarea eliminada" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
