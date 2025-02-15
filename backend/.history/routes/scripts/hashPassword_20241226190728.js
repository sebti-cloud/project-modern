const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
};

// Appelle la fonction avec le mot de passe souhaité
hashPassword('Acb123'); // Remplace 'nouveau_mot_de_passe' par ton nouveau mot de passe
