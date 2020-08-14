const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
