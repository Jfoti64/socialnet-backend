// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Post from './Post.js';
import Comment from './Comment.js';
import FriendRequest from './FriendRequest.js';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Cascade delete middleware
UserSchema.pre('remove', async function (next) {
  await Post.deleteMany({ author: this._id });
  await Comment.deleteMany({ author: this._id });
  await FriendRequest.deleteMany({ requester: this._id });
  await FriendRequest.deleteMany({ recipient: this._id });
  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
