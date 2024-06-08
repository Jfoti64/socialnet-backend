import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import { connectDB, disconnectDB, clearDB, createUser } from '../config/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('User Profile Routes', () => {
  let user, token;

  beforeEach(async () => {
    user = await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });

    token = res.body.token;
  });

  it('should get the current user profile', async () => {
    const res = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('firstName', 'John');
    expect(res.body).toHaveProperty('lastName', 'Doe');
  });

  it('should get another user profile by ID', async () => {
    const otherUser = await createUser({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .get(`/users/profile/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('firstName', 'Jane');
    expect(res.body).toHaveProperty('lastName', 'Doe');
  });
});
