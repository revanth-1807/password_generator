const express = require('express');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function generatePassword(length, options) {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numericChars = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  let charSet = '';
  
  if (options.uppercase) charSet += upperCaseChars;
  if (options.lowercase) charSet += lowerCaseChars;
  if (options.numbers) charSet += numericChars;
  if (options.specialChars) charSet += specialChars;

  if (!charSet) throw new Error('No character types selected');

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charSet.length);
    password += charSet[randomIndex];
  }

  return password;
}

app.get('/', (req, res) => {
  res.render('index', { password: '', error: '' });
});

app.post('/generate-password', (req, res) => {
  const { length, uppercase, lowercase, numbers, specialChars } = req.body;

  if (!length || length < 6) {
    return res.render('index', { password: '', error: 'Password length must be at least 6' });
  }

  const options = {
    uppercase: uppercase || false,
    lowercase: lowercase || false,
    numbers: numbers || false,
    specialChars: specialChars || false,
  };

  try {
    const password = generatePassword(length, options);
    res.render('index', { password, error: '' });
  } catch (error) {
    res.render('index', { password: '', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Password Generator app listening at http://localhost:${port}`);
});
