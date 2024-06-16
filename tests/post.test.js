import request from 'supertest';
import { describe, beforeAll, beforeEach, afterAll, afterEach, it, expect } from '@jest/globals';
import { connectDB, disconnectDB, clearDB, createUser } from '../config/db.js';
import app from '../server.js';
import Comment from '../models/Comment.js'; // Import the Comment model

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

  it('should delete a post and its comments', async () => {
    // Create a new post
    const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test post',
    });

    const postId = postRes.body._id;

    // Add a comment to the post
    const commentRes = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment',
      });

    const commentId = commentRes.body._id;

    // Delete the post
    const deleteRes = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('message', 'Post removed');

    // Check if the comment is also deleted
    const deletedComment = await Comment.findById(commentId);
    expect(deletedComment).toBeNull();
  });
});
