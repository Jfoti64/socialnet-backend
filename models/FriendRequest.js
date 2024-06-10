import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;
