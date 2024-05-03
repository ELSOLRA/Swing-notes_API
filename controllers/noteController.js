const noteService = require("../services/noteService");

// Hämtar alla anteckningar
const getAllNotes = async (req, res) => {
  try {
    const userId = req.userId;
// Hämtar alla anteckningar för den angivna användaren
    const notes = await noteService.findAll(userId);
// Tar bort _id och userId för att skicka anteckningarna utan till svar
    const notesWithoutId = notes.map((note) => {
      const { _id, userId, ...noteWithoutIds } = note;
      return noteWithoutIds;
    });

    res.status(200).json(notesWithoutId);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Ett fel inträffade vid hämtning av anteckningar.",
      });
  }
};
// Skapar en ny anteckning
const createNote = async (req, res) => {
  try {
// Hämtar anteckningsdata från requesten
    const noteData = req.body;
// Hämtar användar-ID från requesten
    const userId = req.userId;
// Skapar den nya anteckningen med den angivna datan och användar-ID
    await noteService.create(noteData, userId);

    res.status(201).json({ success: true, message: `Skapades` });
  } catch (error) {
    const status =
      error.message === "En anteckning med samma titel och text finns redan"
        ? 409
        : error.message === "Titeln på anteckningen: Max 50 tecken" ||
          error.message === "Anteckningstext: Max 300 tecken"
        ? 400
        : 500;
    const errorMessage =
      status === 500
        ? "Ett fel inträffade när du försökte skapa noten."
        : error.message;
    res.status(status).json({ success: false, error: errorMessage });
  }
};

// Uppdaterar en befintlig anteckning
const updateNote = async (req, res) => {
  try {

// Hämtar antecknings-ID från URL-parametern
    const id = req.params.noteId;
// Hämtar uppdaterad anteckningsdata från requesten
    const noteUpdates = req.body;
// Hämtar användar-ID från requesten
    const userId = req.userId;

// Kontrollerar om några ändringar har gjorts
    if (Object.keys(noteUpdates).length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Inga ändringar har gjorts i anteckningen",
        });
    }

    await noteService.update(id, noteUpdates, userId);

    res.status(200).json({ success: true, message: `Anteckning uppdaterad` });
  } catch (error) {
    if (error.message === "Anteckning hittades inte") {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === "Du har inte behörighet att ändra denna anteckning") {
      return res.status(403).json({ success: false, error: error.message });
    }

    const status =
      error.message ===
      ("Titeln på anteckningen: Max 50 tecken" ||
        error.message === "Anteckningstext: Max 300 tecken")
        ? 400
        : 500;
    const errorMessage =
      status === 500
        ? "Ett fel inträffade när du försökte skapa noten"
        : error.message;
    res.status(status).json({ success: false, error: errorMessage });
  }
};

// Raderar en befintlig anteckning
const deleteNote = async (req, res) => {
  try {
// Hämtar antecknings-ID från url-parametern
    const id = req.params.noteId;
// Hämtar användar-ID från requesten
    const userId = req.userId;

    await noteService.delete(id, userId);

    res.status(200).json({ success: true, message: `Anteckning raderad` });
  } catch (error) {
    if (error.message === "Anteckning hittades inte") {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (
      error.message === "Du har inte behörighet att ta bort denna anteckning"
    ) {
      return res.status(403).json({ success: false, error: error.message });
    }

    res
      .status(500)
      .json({
        success: false,
        error: "Ett fel inträffade när du försökte radera anteckningen",
      });
  }
};

// Söker efter anteckningar
const searchNotes = async (req, res) => {
  try {
// Hämtar användar-ID från requesten
    const userId = req.userId;
// Hämtar sökfrågan från query-parametern
    const query = req.query.title;
// Kontrollerar om sökfrågan finns
    if (!query) {
      return res
        .status(400)
        .json({ success: false, error: "Frågeparametern saknas" });
    }

    const noteSeach = await noteService.searchByTitle(query, userId);
// Tar bort _id och userId för att skicka anteckningarna utan till svar
    const notesWithoutId = noteSeach.map((note) => {
      const { _id, userId, ...noteWithoutIds } = note;
      return noteWithoutIds;
    });

    res.status(200).json(notesWithoutId);
  } catch (error) {
    if (error.message.startsWith("Inga anteckningar hittades för sökningen")) {
      return res.status(404).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
};
