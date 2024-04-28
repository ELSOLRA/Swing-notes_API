const { notesDb, Note } = require('../models/noteModel');
const uuid = require('uuid');


const noteService = {
    create: async (noteData) => {

        const note = new Note(); 

        note.noteId = uuid.v4();
        note.title = noteData.title;
        note.text = noteData.text;
        note.createdAt = new Date();    // needs UTC format
        note.modifiedAt = new Date(); // needs UTC format
        note.userId = noteData.userId;

        if(note.title.length > 50) {
            throw new Error('Titeln på anteckningen: Max 50 tecken');
        };
        if(note.text.length > 300) {
            throw new Error('Anteckningstext: Max 300 tecken');
        };
        
        const newNote = await notesDb.insert(note);
        return newNote;
    },

    findAll: async () => {
        return await notesDb.find({});
    },

    findById: async (id) => {
        const note = await notesDb.findOne({ noteId: id });
        if (!note) {
            throw new Error('Anteckningen hittades inte');
        }
        return note;
    },

    update: async (id, updates) => {
        if (updates.title && updates.title.length > 50) {
          throw new Error('Titeln på anteckningen: Max 50 tecken');
        }
    
        if (updates.text && updates.text.length > 300) {
          throw new Error('Anteckningstext: Max 300 tecken');
        }
    
        updates.modifiedAt = new Date();
        const updatedNote = await notesDb.update({ noteId: id }, { $set: updates });
        return updatedNote;
      },

    delete: async (id) => {
        await notesDb.remove({ noteId: id });
    },
    
}

module.exports = noteService;