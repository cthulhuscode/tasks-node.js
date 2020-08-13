const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Read header token
  const token = req.header("x-auth-token");

  // Check if there isn't token
  if (!token) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  // Validate token
  try {
    const encoded = jwt.verify(token, process.env.SECRET);
    req.user = encoded.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Token no válido" });
  }
};
