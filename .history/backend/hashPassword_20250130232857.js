const bcrypt = require('bcrypt');

const password = 'mama';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Generated hash:', hash);
  }
});



