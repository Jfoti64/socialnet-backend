// auth.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('No Authorization header provided');
    return res.status(401).send({ error: 'Access denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.error('No token provided');
    return res.status(401).send({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token', err);
    res.status(400).send({ error: 'Invalid token' });
  }
});

export default auth;
