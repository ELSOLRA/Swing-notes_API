const noteService = require('../services/noteService');


const getAllNotes = async (req, res) => {
     try {
        const userId = req.userId;
        const notes = await noteService.findAll(userId);
      
        res.status(200).json(notes)
        
     } catch (error) {
        res.status(500).json({error: 'Ett fel inträffade vid hämtning av anteckningar.' }) 
     }
};

const createNote = async (req, res) => {
    try {
        const noteData = req.body;
        const userId = req.userId;
        await noteService.create(noteData, userId);

        res.status(201).json({ success: true, message: `Skapades` })
        
    } catch (error) {
        console.error("Error occurred:", error.message);
        // res.status(error.message === 'En anteckning med samma titel och text finns redan' ? 409 : 400).json({ error: error.message });
        /* const status = error.message === 'En anteckning med samma titel och text finns redan' ? 409 : 400;
        res.status(status).json({ error: error.message }); */
        const status = error.message === 'En anteckning med samma titel och text finns redan' ? 409 :
        (error.message === 'Titeln på anteckningen: Max 50 tecken' || error.message === 'Anteckningstext: Max 300 tecken') ? 400 : 500;
    const errorMessage = status === 500 ? 'Ett fel inträffade när du försökte skapa noten.' : error.message;
    res.status(status).json({ error: errorMessage });
    }
}

const updateNote = async (req, res) => {
    try {
       const id = req.params.noteId;
       const noteUpdates = req.body;
       const userId = req.userId;

       if (Object.keys(noteUpdates).length === 0) {
        return res.status(400).json({ error: 'Inga ändringar har gjorts i anteckningen' });
        }

        await noteService.update(id, noteUpdates, userId);
    
        res.status(200).json({ success: true, message: `Anteckning uppdaterad` })
    } catch (error) {

        
        if (error.message === 'Anteckning hittades inte') {
            return res.status(404).json({ error: error.message })
        }
        if (error.message === 'Du har inte behörighet att ändra denna anteckning') {
            return res.status(403).json({ error: error.message })
        }

        const status = error.message === ('Titeln på anteckningen: Max 50 tecken' || error.message === 'Anteckningstext: Max 300 tecken') ? 400 : 500;
        const errorMessage = status === 500 ? 'Ett fel inträffade när du försökte skapa noten' : error.message;
        res.status(status).json({ error: errorMessage });
    }

}

const deleteNote = async (req, res) => {

    try {
        const id = req.params.noteId;
        const userId = req.userId;

        await noteService.delete(id, userId);

        res.status(200).json({ success: true, message: `Anteckning raderad` });
    } catch (error) {

        if (error.message === 'Anteckning hittades inte') {
            return res.status(404).json({ error: error.message })
        }
        if (error.message === 'Du har inte behörighet att ta bort denna anteckning') {
            return res.status(403).json({ error: error.message })
        }

        res.status(500).json({ error: 'Ett fel inträffade när du försökte radera anteckningen' });
    }
}

const searchNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const query = req.query.title;
        console.log(req.query);
        console.log(query);

        if (!query) {
            return res.status(400).json({ error: 'Frågeparametern saknas' });
        }

        const noteSeach = await noteService.searchByTitle(query, userId);

        res.status(200).json(noteSeach);
        
    } catch (error) {

        if (error.message.startsWith('Inga anteckningar hittades för sökningen')) {
            return res.status(404).json({ error: error.message })
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllNotes, createNote, updateNote, deleteNote, searchNotes };

