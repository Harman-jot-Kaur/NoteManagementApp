"use strict";

const router = require("express").Router();
const authenticateToken = require("../middleware/auth");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  noteValidation,
} = require("../controllers/notesController");

// All notes routes require a valid JWT
router.use(authenticateToken);

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", noteValidation, createNote);
router.put("/:id", noteValidation, updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
