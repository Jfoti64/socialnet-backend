// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxLength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
