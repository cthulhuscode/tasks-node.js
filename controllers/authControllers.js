const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Login
exports.authenticateUser = async (req, res) => {
  //Check if there are not errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({
        msg: "Todos los campos son obligatorios",
        errors: errors.array(),
      });

  // Extract email and password
  const { email, password } = req.body;

  try {
    // User exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    //Check if password is correct
    const decryptedPassword = await bcryptjs.compare(password, user.password);
    if (!decryptedPassword) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Authenticatre user
    // Create JWT
    const payload = {
      user: { id: user.id },
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, // 1hr
      },
      (error, token) => {
        if (error) throw error;

        res.status(200).json({
          msg: "Success",
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Get data from the auth user
exports.getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
