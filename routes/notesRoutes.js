const express = require('express');
const noteController = require('../controllers/noteController');


const router = express.Router();

router.get('/', noteController.getAllNotes);
router.post('/', noteController.createNote );
/* router.put('/', async (req, res) => {

} ); */
/* router.delete('/', async (req, res) => {

} ); */

/* router.get('/search', async (req, res) => {

} ); */

module.exports = router;
