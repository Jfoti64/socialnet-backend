import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
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

describe('User Profile Routes', () => {
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

  it('should get the current user profile', async () => {
    const res = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('firstName', 'John');
    expect(res.body).toHaveProperty('lastName', 'Doe');
  });

  it('should get another user profile by ID', async () => {
    const otherUser = await createUser({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .get(`/users/profile/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('firstName', 'Jane');
    expect(res.body).toHaveProperty('lastName', 'Doe');
  });
});

describe('Check Friend Request Status', () => {
  let user, otherUser, token;

  beforeEach(async () => {
    user = await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    otherUser = await createUser({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    });

    token = res.body.token;
  });

  it('should return pending if a friend request is already sent', async () => {
    await FriendRequest.create({
      requester: user._id,
      recipient: otherUser._id,
    });

    const res = await request(app)
      .get(`/users/friend-request-status/${user._id}/${otherUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'pending');
  });

  it('should return friends if users are already friends', async () => {
    user.friends.push(otherUser._id);
    otherUser.friends.push(user._id);
    await user.save();
    await otherUser.save();

    const res = await request(app)
      .get(`/users/friend-request-status/${user._id}/${otherUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'friends');
  });

  it('should return none if no friend request is sent and users are not friends', async () => {
    const res = await request(app)
      .get(`/users/friend-request-status/${user._id}/${otherUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'none');
  });
});
