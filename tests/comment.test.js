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

let user, token, postId, commentId, secondCommentId, otherUserToken;

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

  const postRes = await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({
    content: 'This is a test post',
  });
  postId = postRes.body._id;

  const commentRes = await request(app)
    .post(`/posts/${postId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'This is a test comment',
    });
  commentId = commentRes.body._id;

  const secondCommentRes = await request(app)
    .post(`/posts/${postId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      content: 'This is a second test comment',
    });
  secondCommentId = secondCommentRes.body._id;

  const otherUser = await createUser({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'password123',
  });

  const otherRes = await request(app).post('/auth/login').send({
    email: 'jane@example.com',
    password: 'password123',
  });

  otherUserToken = otherRes.body.token;
});

describe('Comment Routes', () => {
  it('should create a new comment', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is another test comment',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is another test comment');
  });

  it('should get all comments for a post', async () => {
    const res = await request(app)
      .get(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('content', 'This is a test comment');
  });

  it('should update a comment', async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Updated comment content',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'Updated comment content');
  });

  it('should delete a comment', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Comment removed');

    const postRes = await request(app)
      .get(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`);
    expect(postRes.statusCode).toEqual(200);
    expect(postRes.body).toHaveLength(1); // since one comment was removed
  });

  it('should not create a comment with empty content', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should not update a comment without authorization', async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({
        content: 'Updated content without authorization',
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe('User not authorized');
  });

  it('should return 400 if content is missing', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/users/me');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 403 if user is not authorized to delete a comment', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);
    expect(res.statusCode).toEqual(403);
  });
});
