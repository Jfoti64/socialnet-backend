// models/Post.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxLength: 1000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxLength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
