const express = require('express');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to handle static files and JSON requests
app.use(express.static(path.join(__dirname, 'public')));

// Add middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Add middleware to parse JSON bodies (for potential future API usage)
app.use(express.json());

// Enable CORS if needed
app.use(cors());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Function to generate a random password
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

// Route to render the password generator form
app.get('/', (req, res) => {
  res.render('index', { password: '', error: '' });
});

// Route to generate password
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
