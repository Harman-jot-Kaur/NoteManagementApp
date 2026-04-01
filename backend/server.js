"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(
  cors({
    origin: "*", // tighten in production (e.g. 'http://127.0.0.1:5500')
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ message: "Notes API is running." }));

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
);
