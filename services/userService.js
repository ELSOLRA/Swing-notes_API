const usersDb = require("../models/userModel");
const bcrypt = require("../utils/bcrypt");
const uuid = require("uuid");

//Definierar en userService för att hantera logiken 
const userService = {
// funktion för att lagra en ny användare
  storeUser: async (username, password, email) => {
    try {
// Unikt användar-ID
      const userId = uuid.v4();
// Krypterar lösenordet
      const hashedPassword = await bcrypt.hashPassword(password);
// Lagrar den nya användaren i databasen
      const newUser = await usersDb.insert({
        username: username,
        password: hashedPassword,
        email: email,
        userId: userId,
      });
      return newUser;
    } catch (error) {
      throw new Error("Misslyckades med att spara användaren i databasen");
    }
  },
// Hittar en användare baserat på användarnamn
  findUser: async (username) => {
    return await usersDb.findOne({ username });
  },
// Lösenordets validering
  passwordValidation: async (password, hashedPassword) => {
    return await bcrypt.comparePassword(password, hashedPassword);
  },
};

module.exports = userService;
