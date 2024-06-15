import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createFakeUser = () => {
  return new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profilePicture: faker.image.avatar(),
    friends: [],
    friendRequests: [],
  });
};

const seedUsers = async (numUsers = 10) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (let i = 0; i < numUsers; i++) {
      const fakeUser = createFakeUser();
      await fakeUser.save();
      console.log(`Created user: ${fakeUser.firstName} ${fakeUser.lastName}`);
    }

    console.log('User seeding completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

seedUsers(10); // Change the number to seed more or fewer users
