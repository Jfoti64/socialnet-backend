import request from 'supertest';
import app from '../server.js'; // Adjust the path if necessary
import { connectDB, disconnectDB, clearDB, createUser } from '../config/db.js';
import { generateExpiredToken } from '../utils/token.js';
import { generateToken } from '../controllers/authController.js';
import { generateObjectId } from '../utils/objectId.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to login with invalid email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'invalidemail',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('Please include a valid email');
  });

  it('should fail to login with missing password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual('Password is required');
  });

  it('should fail to register a user with an existing email', async () => {
    await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/register').send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });

  it('should return 401 for requests without Authorization header', async () => {
    const res = await request(app).get('/users/me').expect(401);
    expect(res.body).toHaveProperty('error', 'Access denied');
  });

  it('should return 401 for requests with invalid token', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
    expect(res.body).toHaveProperty('error', 'Invalid token');
  });

  it('should return 401 for expired token', async () => {
    const userId = generateObjectId(); // Generate a valid ObjectId
    await createUser({
      _id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    const expiredToken = generateExpiredToken(userId); // Use the valid ObjectId to generate the expired token
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
    expect(res.body).toHaveProperty('error', 'Invalid token');
  });

  it('should allow access with valid token', async () => {
    const userId = generateObjectId(); // Generate a valid ObjectId
    await createUser({
      _id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    const validToken = generateToken(userId); // Use the valid ObjectId to generate the valid token
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('_id');
  });
});
