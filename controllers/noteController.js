const noteService = require('../services/noteService');


const getAllNotes = async (req, res) => {
     try {
        const notes = await noteService.findAll();
        res.status(200).json(notes)
        
     } catch (error) {
        res.status(500).json({error: 'Ett fel inträffade vid hämtning av anteckningar.' }) 
     }
};

const createNote = async (req, res) => {
    try {
        const noteData = req.body;
        const newNote = await noteService.create(noteData);

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

module.exports = { getAllNotes, createNote };