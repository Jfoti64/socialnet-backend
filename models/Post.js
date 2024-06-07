import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxLength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        content: { type: String, required: true, maxLength: 1000 },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
