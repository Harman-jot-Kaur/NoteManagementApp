"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");

// ── Validation rules ──────────────────────────────────────────
const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be 3–50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username may only contain letters, numbers and underscores."),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

const loginValidation = [
  body("email").normalizeEmail().isEmail().withMessage("Valid email required."),
  body("password").notEmpty().withMessage("Password is required."),
];

// ── Helper ────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

// ── POST /api/auth/signup ─────────────────────────────────────
async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check for duplicate username / email
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username],
    );
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Email or username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    const newUser = { id: result.insertId, username, email };
    const token = generateToken(newUser);

    res
      .status(201)
      .json({ message: "Account created successfully.", token, user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during sign-up." });
  }
}

// ── POST /api/auth/login ──────────────────────────────────────
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = generateToken(safeUser);

    res.json({ message: "Login successful.", token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
}

module.exports = { signup, login, signupValidation, loginValidation };
