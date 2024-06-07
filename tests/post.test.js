import request from 'supertest';
import { describe, beforeAll, beforeEach, afterAll, afterEach, it, expect } from '@jest/globals';
import { connectDB, disconnectDB, clearDB, createUser } from '../config/db.js';
import app from '../server.js';

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
  });

  it('should create a new post', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a test post');
    expect(res.body).toHaveProperty('author', user.id);
  });

  it('should get all posts', async () => {
    await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });

    const res = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('content', 'This is a test post');
  });

  it('should get a post by ID', async () => {
    const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });

    const postId = postRes.body._id;
    const res = await request(app).get(`/posts/${postId}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'This is a test post');
  });

  it('should update a post', async () => {
    const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });

    const postId = postRes.body._id;
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Updated post content',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'Updated post content');
  });

  it('should delete a post', async () => {
    const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });

    const postId = postRes.body._id;
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Post removed');
  });
});
