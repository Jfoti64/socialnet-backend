// tests/post.test.js
import request from 'supertest';
import { describe, beforeAll, beforeEach, afterAll, afterEach, it, expect } from '@jest/globals';
import { connectDB, disconnectDB, clearDB } from '../config/db.js';
import app from '../server.js';
import User from '../models/User.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Post Routes', () => {
  let user, token;

  beforeEach(async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    token = res.body.token;
    user = await User.findOne({ email: 'john@example.com' });
  });

  it('should create a new post', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a test post');
    expect(res.body).toHaveProperty('author', user.id);
  });

  // Add more tests for get, update, delete, etc.
});
