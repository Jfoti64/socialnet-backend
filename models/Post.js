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
PostSchema.pre('findOneAndDelete', async function (next) {
  const postId = this.getQuery()['_id'];
  await Comment.deleteMany({ post: postId });
  next();
});

// Virtual field for like count
PostSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Ensure virtual fields are serialized
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

export default mongoose.model('Post', PostSchema);
