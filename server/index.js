const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_if_env_missing';

// Connect to the first database
const connection1 = mongoose.createConnection(process.env.MONGO_DB1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection1.on('connected', () => {
  console.log('Connected to first database');
});

// Connect to the second database
const connection2 = mongoose.createConnection(process.env.MONGO_DB2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection2.on('connected', () => {
  console.log('Connected to second database');
});

// Define schemas and models for each connection
const LogSchema = new mongoose.Schema({
  email: String,
  student_number: String,
  login_date: String,
  remaining_time: Number,
  timestamp: String,
  logout_time: String,
});

const AccountModelDB1 = connection1.model('Account', LogSchema, 'accounts');
const LogModelDB2 = connection2.model('Log', LogSchema, 'logs');

// Schema and Model for the `users` collection
const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // This will be hashed
});
const UserModelDB1 = connection1.model('Admin', UserSchema, 'admin');

// Registration endpoint with password hashing
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModelDB1.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = new UserModelDB1({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModelDB1.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the plaintext password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch data from the first database
app.get('/getUsersFromDB1', (req, res) => {
  AccountModelDB1.find()
    .then(logs => res.json(logs))
    .catch(err => res.status(500).json(err));
});

// Fetch data from the second database
app.get('/getUsersFromDB2', (req, res) => {
  LogModelDB2.find()
    .then(logs => res.json(logs))
    .catch(err => {
      console.error('Error fetching logs:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
