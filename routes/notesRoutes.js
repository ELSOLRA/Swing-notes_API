const express = require('express');
const noteController = require('../controllers/noteController');


const router = express.Router();

router.get('/', noteController.getAllNotes);
router.post('/', noteController.createNote );
router.put('/:noteId', noteController.updateNote); 
router.delete('/:noteId', noteController.deleteNote );

/* router.get('/search', async (req, res) => {

} ); */

module.exports = router;
