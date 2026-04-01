"use strict";

const jwt = require("jsonwebtoken");

/**
 * Express middleware that validates the JWT sent in the
 * Authorization header (Bearer <token>).
 * On success it attaches `req.user = { id, username, email }`.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decoded; // { id, username, email, iat, exp }
    next();
  });
}

module.exports = authenticateToken;
