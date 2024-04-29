const usersDb = require("../models/userModel");
const bcrypt = require("../utils/bcrypt");
const uuid = require("uuid");

const userService = {
  storeUser: async (username, password, email) => {
    try {
      const userId = uuid.v4();
      const hashedPassword = await bcrypt.hashPassword(password);
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

  findUser: async (username) => {
    return await usersDb.findOne({ username });
  },

  passwordValidation: async (password, hashedPassword) => {
    return await bcrypt.comparePassword(password, hashedPassword);
  },
};

module.exports = userService;
