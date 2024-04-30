const { notesDb, Note } = require("../models/noteModel");
const uuid = require("uuid");

const noteService = {
  create: async (noteData, userId) => {
    const noteId = uuid.v4();
    const createdAt = new Date();
    const modifiedAt = new Date();

    const note = new Note(
      noteId,
      noteData.title,
      noteData.text,
      createdAt,
      modifiedAt,
      userId
    );

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

    const newNote = await notesDb.insert(note);
    return newNote;
  },

  findAll: async (userId) => {
    return await notesDb.find({ userId: userId });
  },

/*   findById: async (id) => {
    const note = await notesDb.findOne({ noteId: id });
    if (!note) {
      throw new Error("Anteckningen hittades inte");
    }
    return note;
  }, */

  update: async (id, updates, userId) => {
    const note = await checkExistingNoteById(id);
    if (note.userId !== userId) {
      throw new Error('Du har inte behörighet att ändra denna anteckning');
  }

    if (updates.title && updates.title.length > 50) {
      throw new Error("Titeln på anteckningen: Max 50 tecken");
    }

    if (updates.text && updates.text.length > 300) {
      throw new Error("Anteckningstext: Max 300 tecken");
    }

    updates.modifiedAt = new Date();
    const updatedNote = await notesDb.update({ noteId: id }, { $set: updates });
    return updatedNote;
  },

  delete: async (id, userId) => {
    const note = await checkExistingNoteById(id);
    if (note.userId !== userId) {
      throw new Error('Du har inte behörighet att ta bort denna anteckning');
  }
    await notesDb.remove({ noteId: id });
  },

  searchByTitle: async (title, userId) => {
    
     const search = await notesDb.find({ title: { $regex: new RegExp(title, 'i') }, userId: userId });  // 'i' - Case-insensitive
     if (search.length === 0) {
      throw new Error(`Inga anteckningar hittades för sökningen '${title}'`);
     }
     return search;
  }

};

const checkExistingNoteById = async (id) => {
  const existingNote = await notesDb.findOne({ noteId: id });
  if (!existingNote) {
    throw new Error("Anteckning hittades inte");
  }
  return existingNote;
};

module.exports = noteService;
