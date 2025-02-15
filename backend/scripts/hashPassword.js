const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
};

// Appelle la fonction avec le mot de passe souhaité
hashPassword('khti1999'); // Remplace 'Acab' par ton mot de passe souhaité
