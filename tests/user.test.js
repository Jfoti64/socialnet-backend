import { connectDB, disconnectDB, clearDB, createUser } from '../config/db.js';
import User from '../models/User.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('User model', () => {
  it('should hash the password before saving', async () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await user.save();
    expect(user.password).not.toBe('password123');
  });

  it('should compare passwords correctly', async () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await user.save();
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should enforce unique email constraint', async () => {
    const user1 = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await user1.save();

    const user2 = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Mongoose duplicate key error code
  });

  it('should handle friends and friendRequests correctly', async () => {
    const user1 = await createUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john1@example.com',
      password: 'password123',
    });
    const user2 = await createUser({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    user1.friends.push(user2._id);
    user2.friendRequests.push(user1._id);

    await user1.save();
    await user2.save();

    const updatedUser1 = await User.findById(user1._id).populate('friends');
    const updatedUser2 = await User.findById(user2._id).populate('friendRequests');

    expect(updatedUser1.friends).toHaveLength(1);
    expect(updatedUser1.friends[0]._id.toString()).toBe(user2._id.toString());

    expect(updatedUser2.friendRequests).toHaveLength(1);
    expect(updatedUser2.friendRequests[0]._id.toString()).toBe(user1._id.toString());
  });
});
