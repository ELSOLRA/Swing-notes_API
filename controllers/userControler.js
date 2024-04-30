const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const usernameExists = await userService.findUser(username);

    if (usernameExists) {
      const { username } = usernameExists;
      res
        .status(400)
        .json({
          success: false,
          message: `Användarnamnet ${username} finns redan`,
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
      .json({ message: "Internt serverfel vid användarskapande", error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userService.findUser(username);

    if (!existingUser) {
      return res.status(404).json({ message: "Användaren kunde inte hittas" });
    }

    const validPassword = await userService.passwordValidation(
      password,
      existingUser.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" });
    }

    const token = jwt.sign(
      { userId: existingUser.userId },
      process.env.JWT_SECRET,
      { expiresIn: 6000 }
    );
    return res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Fel vid inloggning" });
  }
};

module.exports = { signUp, login };
