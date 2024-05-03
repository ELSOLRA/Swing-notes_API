const jwt = require("jsonwebtoken");

// Funktion för autentisering
const authMiddleware = (req, res, next) => {
// Extraherar JWT-token från authorization-headern
  const token = req.headers.authorization?.split(" ")[1];
// Kontrollerar om det finns ett JWT-token
  if (!token) {
    return res.status(401).json({ error: "Autentiseringstoken saknas" });
  }

  try {
// Verifierar JWT-token med hjälp av den hemliga nyckeln (JWT_SECRET)
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
// Extraherar användar-ID från den verifierade token
    req.userId = decodedData.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: "Ogiltigt token" });
  }
};

module.exports = authMiddleware;
