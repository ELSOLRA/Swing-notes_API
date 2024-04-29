const { notesDb, Note } = require('../models/noteModel');
const uuid = require('uuid');


const noteService = {
    create: async (noteData) => {

        const noteId = uuid.v4();
        const createdAt = new Date();
        const modifiedAt = new Date();

        const note = new Note(
            noteId,
            noteData.title,
            noteData.text,
            createdAt,
            modifiedAt,
            noteData.userId
        );

        if(note.title.length > 50) {
            throw new Error('Titeln på anteckningen: Max 50 tecken');
        };
        if(note.text.length > 300) {
            throw new Error('Anteckningstext: Max 300 tecken');
        };
        
        const existingNote = await notesDb.findOne({ title: note.title, text: note.text });
        if (existingNote) {
          throw new Error('En anteckning med samma titel och text finns redan');
        }
        
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

        await checkExistingNoteById(id);

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

        await checkExistingNoteById(id);
        await notesDb.remove({ noteId: id });
    },
    
}

const checkExistingNoteById = async (id) => {
    const existingNote = await notesDb.findOne({ noteId: id });
    if (!existingNote) {
        throw new Error('Anteckning hittades inte');
    }
}

module.exports = noteService;