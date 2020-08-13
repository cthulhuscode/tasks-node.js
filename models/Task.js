const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Completa", "Incompleta"],
    default: "Incompleta",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
