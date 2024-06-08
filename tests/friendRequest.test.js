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

describe('Friend Request Routes', () => {
  let user1, user2, user1Token, user2Token;

  beforeEach(async () => {
    user1 = await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john1@example.com',
      password: 'password123',
    });

    user2 = await createUser({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    let res = await request(app).post('/auth/login').send({
      email: 'john1@example.com',
      password: 'password123',
    });

    user1Token = res.body.token;

    res = await request(app).post('/auth/login').send({
      email: 'jane@example.com',
      password: 'password123',
    });

    user2Token = res.body.token;
  });

  it('should send a friend request', async () => {
    const res = await request(app)
      .post('/users/friend-request')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ recipientId: user2._id });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Friend request sent');

    const updatedUser2 = await User.findById(user2._id);
    expect(updatedUser2.friendRequests).toHaveLength(1);
    expect(updatedUser2.friendRequests[0].toString()).toBe(user1._id.toString());
  });

  it('should accept a friend request', async () => {
    await request(app)
      .post('/users/friend-request')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ recipientId: user2._id });

    const res = await request(app)
      .post('/users/accept-friend-request')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ requesterId: user1._id });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Friend request accepted');

    const updatedUser1 = await User.findById(user1._id).populate('friends');
    const updatedUser2 = await User.findById(user2._id).populate('friends');

    expect(updatedUser1.friends).toHaveLength(1);
    expect(updatedUser1.friends[0]._id.toString()).toBe(user2._id.toString());

    expect(updatedUser2.friends).toHaveLength(1);
    expect(updatedUser2.friends[0]._id.toString()).toBe(user1._id.toString());
  });

  it('should reject a friend request', async () => {
    await request(app)
      .post('/users/friend-request')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ recipientId: user2._id });

    const res = await request(app)
      .post('/users/reject-friend-request')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ requesterId: user1._id });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Friend request rejected');

    const updatedUser2 = await User.findById(user2._id);
    expect(updatedUser2.friendRequests).toHaveLength(0);
  });
});
