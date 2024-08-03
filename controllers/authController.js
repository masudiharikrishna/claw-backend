const supabase = require('../supabase');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  const newUser = new User({ email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully', user: newUser });
};
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const newSession = new Session({
    userId: user._id,
    loginTime: new Date(),
    ipAddress: req.ip
  });

  await newSession.save();

  res.status(200).json({ message: 'Login successful', token, session: newSession });
};

exports.logout = async (req, res) => {
  const { sessionId } = req.body;
  await Session.findByIdAndUpdate(sessionId, { logoutTime: new Date() });

  res.status(200).json({ message: 'Logout successful' });
};
