// utils/token.js
import jwt from 'jsonwebtoken';

export const generateExpiredToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '-1h' }); // Expired one hour ago
};
