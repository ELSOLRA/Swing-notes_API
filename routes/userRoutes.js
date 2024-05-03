const express = require("express");
const userController = require("../controllers/userControler");
// En router-instans med Express.js
const router = express.Router();

// route för att registrera en ny användare
router.post("/signup", userController.signUp);
// route för att logga in en befintlig användare
router.post("/login", userController.login);

module.exports = router;
