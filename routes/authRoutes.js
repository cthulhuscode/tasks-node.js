const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Auth
const auth = require("../middleware/auth");

// Controller
const authController = require("../controllers/authControllers");

// Login
// api/auth
router.post("/", [
  check("email", "Ingresa un email válido").isEmail(),
  check("password", "El password debe ser de mínimo 6 caracteres").isLength({
    min: 6,
  }),
  authController.authenticateUser,
]);

// Get authenticated user
// api/auth
router.get("/", auth, authController.getAuthUser);

module.exports = router;
