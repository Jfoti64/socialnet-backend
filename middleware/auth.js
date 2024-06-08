import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add more transports like File or HTTP if needed
  ],
});

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    logger.error('No Authorization header provided');
    return res.status(401).send({ error: 'Access denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    logger.error('No token provided');
    return res.status(401).send({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Invalid token', { error: err.message });
    res.status(400).send({ error: 'Invalid token' });
  }
});

export default auth;
