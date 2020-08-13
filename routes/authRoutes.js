const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Controller
const authController = require("../controllers/authControllers");

// Authenticate users
// api/auth
router.post("/", [
  check("email", "Ingresa un email válido").isEmail(),
  check("password", "El password debe ser de mínimo 6 caracteres").isLength({
    min: 6,
  }),
  authController.authenticateUser,
]);

module.exports = router;
