// authController.js
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import getGravatarUrl from '../utils/gravatar.js';

// Utility function to generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const googleCallback = (req, res) => {
  const token = generateToken(req.user.id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
};

export const success = (req, res) => {
  res.send({ token: req.query.token });
};

// Validators
const registrationValidators = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

const loginValidators = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

// Register new user
export const register = [
  ...registrationValidators,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      profilePicture: getGravatarUrl(email),
    });

    await user.save();

    const token = generateToken(user.id);
    res.json({ token });
  }),
];

// Login user
export const login = [
  ...loginValidators,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: 'Invalid credentials', errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token });
  }),
];
