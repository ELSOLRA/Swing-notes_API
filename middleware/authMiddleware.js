const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    console.log("token from auth: ", token);
    console.log( process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: 'Autentiseringstoken saknas' });
  };

  try {

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("data",decodedData);
    req.userId = decodedData.userId;
    console.log("Token Id :", decodedData.userId);
  
    next();

  } catch (error) {
    
    res.status(403).json({ message: 'Ogiltigt token' });
  };

};

module.exports = authMiddleware;