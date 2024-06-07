import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('Auth Routes', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/auth_test_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to register a user with an existing email', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });
});
