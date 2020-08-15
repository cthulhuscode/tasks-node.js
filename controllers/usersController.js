const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Create user
exports.addUser = async (req, res) => {
  //Check if there are not errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Error al crear usuario", errors: errors.array() });
  }

  // Extract email and password
  const { email, password } = req.body;

  try {
    // Check if user is unique
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Create user
    user = new User(req.body);

    // Hashear password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

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

        res.status(201).json({
          msg: "Usuario creado correctamente",
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};
