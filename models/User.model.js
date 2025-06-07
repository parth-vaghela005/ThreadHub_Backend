import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
    username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: '' 
  },
  bannerPic: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwN8U653OvsAZLlAPY_kXfCufC4kZTJvkv6Q&s' 
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: String,
    default: ''
  },
  posts: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post'
}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const User  = mongoose.model('User', userSchema);
export default User;
