const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");
// En router-instans med Express.js
const router = express.Router();

// Definierar routerna för CRUD-operationer
router.get("/", authMiddleware, noteController.getAllNotes);
router.post("/", authMiddleware, noteController.createNote);
router.put("/:noteId", authMiddleware, noteController.updateNote);
router.delete("/:noteId", authMiddleware, noteController.deleteNote);
router.get("/search", authMiddleware, noteController.searchNotes);

module.exports = router;
