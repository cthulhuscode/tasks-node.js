const Project = require("../models/Project");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");

// Create project
exports.createProject = async (req, res) => {
  // No errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Error al crear proyecto", errors: errors.array() });
  }

  try {
    const project = new Project(req.body);

    //Add the author
    project.author = req.user.id;

    // Save project
    await project.save();

    res.status(201).json({
      msg: "Proyecto creado correctamente",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get projects
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ author: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      msg: "Proyectos del usuario",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  // No errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Error al actualizar proyecto", errors: errors.array() });
  }

  try {
    // Check id
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        msg: "Es necesario incluir el id del proyecto",
        errors: errors.array(),
      });
    }

    // Project exists
    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
        errors: errors.array(),
      });
    }

    // Is author verified
    if (project.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        msg: "No autorizado",
        errors: errors.array(),
      });
    }

    // Update
    const { name } = req.body;
    const newProject = {
      name,
    };
    project = await Project.findByIdAndUpdate(
      { _id: id },
      { $set: newProject },
      { new: true }
    );

    res.status(200).json({
      msg: "Proyecto actualizado correctamente",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    // Check id
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        msg: "Es necesario incluir el id del proyecto",
        errors: errors.array(),
      });
    }

    // Project exists
    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
        errors: errors.array(),
      });
    }

    // Is author verified
    if (project.author.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        msg: "No autorizado",
        errors: errors.array(),
      });
    }

    // Delete project
    await Project.findOneAndRemove({ _id: id }, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error al eliminar" });
      }

      // Delete tasks from the project deleted
      await Task.deleteMany({ project: id });

      res.status(200).json({ msg: "Proyecto eliminado" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
