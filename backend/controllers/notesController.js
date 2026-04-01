"use strict";

const { body, validationResult } = require("express-validator");
const pool = require("../config/db");

// ── Validation rules ──────────────────────────────────────────
const noteValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Title must be 1–150 characters."),
  body("content").trim().notEmpty().withMessage("Content cannot be empty."),
];

// ── GET /api/notes — all notes for the logged-in user ─────────
async function getNotes(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ error: "Failed to retrieve notes." });
  }
}

// ── GET /api/notes/:id — single note ─────────────────────────
async function getNoteById(req, res) {
  const noteId = Number(req.params.id);
  if (!Number.isInteger(noteId) || noteId < 1) {
    return res.status(400).json({ error: "Invalid note ID." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?",
      [noteId, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Note not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ error: "Failed to retrieve note." });
  }
}

// ── POST /api/notes — create a new note ──────────────────────
async function createNote(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [req.user.id, title, content],
    );

    const [newNote] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json(newNote[0]);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Failed to create note." });
  }
}

// ── PUT /api/notes/:id — update a note ───────────────────────
async function updateNote(req, res) {
  const noteId = Number(req.params.id);
  if (!Number.isInteger(noteId) || noteId < 1) {
    return res.status(400).json({ error: "Invalid note ID." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [title, content, noteId, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Note not found or access denied." });
    }

    const [updated] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?",
      [noteId],
    );
    res.json(updated[0]);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ error: "Failed to update note." });
  }
}

// ── DELETE /api/notes/:id — delete a note ────────────────────
async function deleteNote(req, res) {
  const noteId = Number(req.params.id);
  if (!Number.isInteger(noteId) || noteId < 1) {
    return res.status(400).json({ error: "Invalid note ID." });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [noteId, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Note not found or access denied." });
    }

    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Failed to delete note." });
  }
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  noteValidation,
};
