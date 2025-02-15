const jwt = require('jsonwebtoken');

// Vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.error('Access Denied: No Token Provided!');
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('Token vérifié avec succès:', verified);
    next();
  } catch (err) {
    console.error('Invalid Token', err);
    res.status(400).send('Invalid Token');
  }
};

// Vérifier si l'utilisateur est l'admin principal
const isAdminPrincipal = (req, res, next) => {
  if (req.user.role !== 'admin_principal') {
    console.error('Access Denied: Insufficient Permissions');
    return res.status(403).send('Access Denied: Insufficient Permissions');
  }
  console.log('Permission vérifiée: Admin principal');
  next();
};

module.exports = { verifyToken, isAdminPrincipal };
