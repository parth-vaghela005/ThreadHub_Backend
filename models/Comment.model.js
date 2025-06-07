
import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
    post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: false
        },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Comment= mongoose.model('Comment', commentSchema);
export default Comment;
