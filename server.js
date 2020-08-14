const express = require("express");
const connectDB = require("./config/db");

// Make server
const app = express();

// express-json
app.use(express.json({ extended: true }));

// Routes
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectsRoutes"));
app.use("/api/tasks", require("./routes/tasksRoutes"));

// Connect DB
connectDB(() => {
  //Make server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
  });
});
