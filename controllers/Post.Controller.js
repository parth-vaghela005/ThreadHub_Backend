import Post from "../models/Post.model.js";
import { cloudinary } from "../utility/cloudinary.js";
export const CreatePost = async (req, res) => {
  try {
    const {description } = req.body;    

    if (!description || !req.file) {
      return res.status(400).json({ error: 'Description and file are required.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'posts',
      resource_type: 'auto',
    });

    const post = new Post({
      description,
      mediaUrl: result.secure_url,
      mediaType: result.resource_type,
      author:"6805e514405968c19d593aa1"
    });

    await post.save();
     return  res.status(201).json({
      message: 'Post created success!',
      post: {
        id: post._id,
        description: post.description,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
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






