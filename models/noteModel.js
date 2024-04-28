const Datastore = require('nedb-promise');


const notesDb = new Datastore({ filename: 'notes.db', autoload: true });

class Note {
    constructor(noteId, title, text, createdAt, modifiedAt, userId) {
        this.noteId = noteId;
        this.title = title;
        this.text = text;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.userId = userId;
    }
}


module.exports = { notesDb, Note };