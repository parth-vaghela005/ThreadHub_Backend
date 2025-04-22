import Post from "../models/Post.model.js";
import { cloudinary } from "../utility/cloudinary.js";
export const CreatePost = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Description is required.' });
    }
    const newPost = {
      description,
      author: "6805e514405968c19d593aa1",
    };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'posts',
        resource_type: 'auto',
      });
       newPost.mediaUrl = result.secure_url;
      newPost.mediaType = result.resource_type;
    }
    const post = await Post.create(newPost);
    return res.status(201).json({
      message: 'Post created successfully!',
      post: {
        id: post._id,
        description: post.description,
        mediaUrl: post.mediaUrl || null,
        mediaType: post.mediaType || null,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
export const GetAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name username profilePic')
      .sort({ createdAt: -1 });
  return   res.status(200).json(posts);
  } catch (error) {
    console.error('Get All Posts Error:', error);
  return  res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}






