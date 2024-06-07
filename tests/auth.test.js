import request from 'supertest';
import app from '../server.js';
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

describe('Auth Routes', () => {
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
    await createUser({
      name: 'John Doe',
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
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/register').send({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });
});
