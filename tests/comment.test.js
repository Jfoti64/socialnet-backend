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

describe('Comment Routes', () => {
  let user, token, postId;

  beforeEach(async () => {
    user = await createUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });

    token = res.body.token;

    const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });
    postId = postRes.body._id;
  });

  it('should create a new comment', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a test comment');
  });

  it('should get all comments for a post', async () => {
    await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment',
      });

    const res = await request(app)
      .get(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('content', 'This is a test comment');
  });

  // Additional tests for update and delete can be added similarly
});
