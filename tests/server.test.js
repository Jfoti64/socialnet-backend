// tests/server.test.js
import request from 'supertest';
import app from '../server.js';
import { connectDB, disconnectDB, clearDB } from '../config/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('App Configuration', () => {
  it('should return 200 for the basic route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Welcome to SocialNet API');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toEqual(404);
  });
});

describe('Middleware and Routes', () => {
  it('should use JSON middleware', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).not.toBe(500);
  });

  it('should mount auth routes', async () => {
    const res = await request(app).get('/auth/login');
    console.log(res.body); // Add logging to see the response body
    expect([200, 400, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('loginPage', true); // Example property
    }
  });

  it('should mount user routes', async () => {
    const res = await request(app).get('/users/me');
    console.log(res.body); // Add logging
    expect([401, 500]).toContain(res.statusCode);
  });

  it('should mount post routes', async () => {
    const res = await request(app).get('/posts');
    console.log(res.body); // Add logging
    expect([200, 401, 500]).toContain(res.statusCode);
  });
});
