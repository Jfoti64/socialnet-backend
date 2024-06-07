// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const asyncHandler = require('express-async-handler');

// Google OAuth
exports.googleCallback = asyncHandler((req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`/auth/success?token=${token}`);
});

exports.success = (req, res) => {
  res.send({ token: req.query.token });
};

// Register new user
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({
    name,
    email,
    password,
  });

  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Login user
exports.login = (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    asyncHandler(async (err, user) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    })
  )(req, res, next);
};
