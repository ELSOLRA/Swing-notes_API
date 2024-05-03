const { notesDb, Note } = require("../models/noteModel");
const uuid = require("uuid");

// Definierar en noteService för att hantera logiken 
const noteService = {
// funktion för att skapa en ny anteckning 
  create: async (noteData, userId) => {
// Genererar ett unikt ID
    const noteId = uuid.v4();
// Skapar tidpunkter
    const createdAt = new Date();
    const modifiedAt = new Date();
// Skapar en instans av Note-klassen
    const note = new Note(
      noteId,
      noteData.title,
      noteData.text,
      createdAt,
      modifiedAt,
      userId
    );
// Kontrollerar om det redan finns en anteckning med samma titel och text
    if (note.title.length > 50) {
      throw new Error("Titeln på anteckningen: Max 50 tecken");
    }
    if (note.text.length > 300) {
      throw new Error("Anteckningstext: Max 300 tecken");
    }

    const existingNote = await notesDb.findOne({
      title: note.title,
      text: note.text,
    });
    if (existingNote) {
      throw new Error("En anteckning med samma titel och text finns redan");
    }
// Den nya anteckningen i databasen
    const newNote = await notesDb.insert(note);
    return newNote;
  },
// funktion för att hämta alla anteckningar 
  findAll: async (userId) => {
    return await notesDb.find({ userId: userId });
  },
// funktion för att uppdatera en befintlig anteckning
  update: async (id, updates, userId) => {
// Kontrollera anteckningens existering och om användaren har behörighet att ändra den
    const note = await checkExistingNoteById(id);
    if (note.userId !== userId) {
      throw new Error("Du har inte behörighet att ändra denna anteckning");
    }
// Validering
    if (updates.title && updates.title.length > 50) {
      throw new Error("Titeln på anteckningen: Max 50 tecken");
    }
// Validering
    if (updates.text && updates.text.length > 300) {
      throw new Error("Anteckningstext: Max 300 tecken");
    }
// Uppdatera senast ändringstidpunkten
    updates.modifiedAt = new Date();
    const updatedNote = await notesDb.update({ noteId: id }, { $set: updates });
    return updatedNote;
  },
// funktion för att ta bort en befintlig anteckning 
  delete: async (id, userId) => {
// Kontrollera anteckningens existering och om användaren har behörighet att ändra den
    const note = await checkExistingNoteById(id);
    if (note.userId !== userId) {
      throw new Error("Du har inte behörighet att ta bort denna anteckning");
    }
    await notesDb.remove({ noteId: id });
  },
// funktion för att söka efter anteckningar efter titeln
  searchByTitle: async (title, userId) => {
// Sökningen i databasen med en regex-matching för titeln och userId
    const search = await notesDb.find({
      title: { $regex: new RegExp(title, "i") },    // 'i' - Case-insensitive
      userId: userId,
    }); 
    if (search.length === 0) {
      throw new Error(`Inga anteckningar hittades för sökningen '${title}'`);
    }
    return search;
  },
};
// funktion för att kontrollera om en befintlig anteckning existerar baserat på ID
const checkExistingNoteById = async (id) => {
  const existingNote = await notesDb.findOne({ noteId: id });
  if (!existingNote) {
    throw new Error("Anteckning hittades inte");
  }
  return existingNote;
};

module.exports = noteService;
