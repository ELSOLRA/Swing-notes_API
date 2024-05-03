const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// Registrerar en ny användare
const signUp = async (req, res) => {
  const { username, password, email } = req.body;

  try {
// Kontrollerar om användarnamn, lösenord och e-postadress har angetts
    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Användarnamn saknas" });
    }

    if (!password) {
      return res.status(400).json({ success: false, error: "Lösenord saknas" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "E-postadress saknas" });
    }
// Kontrollerar om användarnamnet redan existerar
    const usernameExists = await userService.findUser(username);

    if (usernameExists) {
      const { username } = usernameExists;
      res.status(400).json({
        success: false,
        error: `Användarnamnet ${username} finns redan`,
      });
      return;
    }
    await userService.storeUser(username, password, email);
    res
      .status(201)
      .json({ success: true, message: `Användaren ${username} skapades` });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Internt serverfel vid användarskapande",
      });
  }
};

// Loggar in en befintlig användare
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
// Kontrollerar om användaren existerar i databasen
    const existingUser = await userService.findUser(username);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, error: "Användaren kunde inte hittas" });
    }
// Validerar användarens lösenord
    const validPassword = await userService.passwordValidation(
      password,
      existingUser.password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Ogiltiga inloggningsuppgifter" });
    }
// Skapar en JWT-token för autentisering
    const token = jwt.sign(
      { userId: existingUser.userId },
      process.env.JWT_SECRET,
      { expiresIn: "30m" } // eller 1800
    );
    return res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Fel vid inloggning" });
  }
};

module.exports = { signUp, login };
