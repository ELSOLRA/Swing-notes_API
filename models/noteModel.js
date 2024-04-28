const Datastore = require('nedb-promise');


const notesDb = new Datastore({ filename: 'notes.db', autoload: true });

const Note = {
    noteId: String,
    title: String,
    text: String,
    createdAt: Date,
    modifiedAt: Date,
    userId: String
}


module.exports = { notesDb, Note };