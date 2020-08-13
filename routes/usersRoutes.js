const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

// Controller
const userController = require("../controllers/usersController");

// Create user
// api/users
router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").trim().notEmpty(),
    check("email", "Ingresa un email válido").trim().isEmail(),
    check("password", "El password debe ser de mínimo 6 caracteres")
      .trim()
      .isLength({
        min: 6,
      }),
  ],
  userController.addUser
);

module.exports = router;
