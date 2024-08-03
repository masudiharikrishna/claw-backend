const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const supabase = require('../config/supabase');
require('dotenv').config();


const register = async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully', user: newUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(400).json({ error: 'Invalid login credentials' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found in MongoDB');
    return res.status(400).json({ error: 'User not found' });
  }
  if (!user.email_confirm) {
    console.log('Email not confirmed for user');
    return res.status(400).json({ error: 'Email not confirmed' });
  }


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Password mismatch');
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const newSession = new Session({
    userId: user._id,
    loginTime: new Date(),
    ipAddress: req.ip
  });
  await newSession.save();

  console.log('Login successful');
  res.status(200).json({ message: 'Login successful', token, session: newSession });
};

const logout = async (req, res) => {
  const { sessionId } = req.body;
  await Session.findByIdAndUpdate(sessionId, { logoutTime: new Date() });

  res.status(200).json({ message: 'Logout successful' });
};

module.exports = { logout, login, register };
