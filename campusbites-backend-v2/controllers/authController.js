// controllers/authController.js
const crypto = require('crypto');
const User = require('../models/user');

// Simple in‑memory session store (mirrors original server)
const sessions = new Map();

function makeId(prefix) {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function createSession(user) {
  const token = makeId('sess');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day
  sessions.set(token, { userId: user.id, expiresAt });
  return token;
}

function getSession(token) {
  const sess = sessions.get(token);
  if (!sess || sess.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return sess;
}

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const errors = {};
  if (!name || name.length < 2) errors.name = 'Name required (2+ chars)';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Valid email required';
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Valid Indian mobile required';
  if (!password || password.length < 8) errors.password = 'Password must be 8+ chars';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ errors: { email: 'Email already registered' } });

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  const passwordHash = `${salt}:${hash}`;

  const user = new User({
    id: makeId('U'),
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
  });
  await user.save();
  const token = createSession(user);
  res.status(201).json({ message: 'Account created', user: { id: user.id, name, email }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ errors: { email: 'Email required', password: 'Password required' } });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ errors: { email: 'No such account' } });
  const [salt, storedHash] = user.passwordHash.split(':');
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  if (!crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(storedHash, 'hex')))
    return res.status(401).json({ errors: { password: 'Incorrect password' } });
  const token = createSession(user);
  res.json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email }, token });
};

exports.logout = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && sessions.has(token)) sessions.delete(token);
  res.json({ message: 'Logged out' });
};

exports.getCurrentUser = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const sess = getSession(token);
  if (!sess) return res.status(401).json({ errors: { auth: 'Invalid session' } });
  User.findOne({ id: sess.userId })
    .then(user => {
      if (!user) return res.status(404).json({ errors: { auth: 'User not found' } });
      res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
    })
    .catch(err => res.status(500).json({ errors: { server: err.message } }));
};
