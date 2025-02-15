const bcrypt = require('bcrypt');

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (match) {
      console.log('Mot de passe correct !');
    } else {
      console.log('Mot de passe incorrect.');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe :', error);
  }
};

const plainPassword = 'mama'; // Le mot de passe en texte clair que tu veux vérifier
const hashedPassword = '$2b$10$xK5dpc3mrHNNq40.LO9eT.2YTmymzQDTMqH1jFT50igoWaZNL4r22'; // Le hachage stocké

verifyPassword(plainPassword, hashedPassword);
