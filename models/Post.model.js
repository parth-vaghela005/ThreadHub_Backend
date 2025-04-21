
import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
      },
      mediaUrl: {
        type: String,
      },
      mediaType: {
        type: String,
        enum: ['image', 'video'],
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Post= mongoose.model('Post', postSchema);
export default Post;
