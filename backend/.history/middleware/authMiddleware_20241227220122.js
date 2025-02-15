const jwt = require('jsonwebtoken');

// Vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Vérifier si l'utilisateur est l'admin principal
const isAdminPrincipal = (req, res, next) => {
  if (req.user.role !== 'admin_principal') {
    return res.status(403).send('Access Denied: Insufficient Permissions');
  }
  next();
};

module.exports = { verifyToken, isAdminPrincipal };
