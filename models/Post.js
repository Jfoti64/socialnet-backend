// models/Post.js
import mongoose from 'mongoose';
import Comment from './Comment.js';

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxLength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Cascade delete comments when a post is deleted
PostSchema.pre('remove', async function (next) {
  await Comment.deleteMany({ post: this._id });
  next();
});

export default mongoose.model('Post', PostSchema);
