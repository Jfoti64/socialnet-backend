import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import Post from '../models/Post.js';

describe('Post Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to a new in-memory database before running any tests.
    const url = `mongodb://127.0.0.1/post_test_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user and obtain a token
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    token = res.body.token;
    userId = res.body.id;
  });

  afterAll(async () => {
    // Remove and close the database connection after all tests.
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new post', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is a test post');
  });

  it('should get all posts', async () => {
    const res = await request(app).get('/posts').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update a post', async () => {
    const post = await Post.create({
      content: 'Original content',
      author: userId,
    });

    const res = await request(app)
      .put(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Updated content',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'Updated content');
  });

  it('should delete a post', async () => {
    const post = await Post.create({
      content: 'Post to delete',
      author: userId,
    });

    const res = await request(app)
      .delete(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Post removed');
  });
});
