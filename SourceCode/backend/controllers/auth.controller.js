const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate a signed JWT for a given user id */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── FR-01: Register ───────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res
        .status(422)
        .json({ message: 'Name, email, password, and phone are required' });
    }

    // Disallow self-registration as admin
    const assignedRole =
      role === 'admin' ? 'patient' : role || 'patient';

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: assignedRole,
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── FR-02: Login ──────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: 'Account deactivated. Contact admin.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get current logged-in user ────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { register, login, getMe };
