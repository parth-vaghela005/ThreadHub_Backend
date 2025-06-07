import Post from "../models/Post.model.js";
import User from "../models/User.model.js"
import Comment from "../models/Comment.model.js";
import { cloudinary } from "../utility/cloudinary.js";
export const CreatePost = async (req, res) => {
  try {
    const { description } = req.body;
    const id = req.id;
    if (!description) {
      return res.status(400).json({ error: 'Description is required.' });
    }
    const newPost = {
      description,
      author: id,
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

    await User.findByIdAndUpdate(req.id, { $push: { posts: post._id } });
    return res.status(201).json({
      message: 'Post created successfully!',
      post: {
        id: post._id,
        description: post.description,
        mediaUrl: post.mediaUrl || null,
        mediaType: post.mediaType || null,
        createdAt: post.createdAt,
        author: post.author || req.id,
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
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Get All Posts Error:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
export const getPostById = async (req, res) => {
  try {
    const { Id } = req.params;
  const post = await Post.findById(Id)
  .populate('author', 'name username profilePic')
  .populate({
    path: 'comments',
    populate: {
      path: 'author',
      select: 'name username profilePic'
    }
  });


    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      post
    });
  } catch (error) {
    console.error('Get Post By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
}
export const  AddComment  = async (req,res) =>{
const {data} = req.body;
const { Id } = req.params;
console.log(Id , "Id");
console.log(data , "data");
const post = await Post.findById(Id);
if(!post){
  return res.status(404).json({
    success:false,
    message:"post not found"
  })
}
if (!data) {
  return res.status(400).json({
    success: false,
    message: 'Comment is required.'
  });
}
const comment  = await Comment.create({
  description:data,
  author: req.id,
  post: Id
});
post.comments.push(comment._id);
await comment.save()
await post.save();
return res.status(200).json({
  success: true,
  message: 'Comment added successfully.',
  post
});
}
export const LikeAndDislikePost = async (req, res) => {
  try {
    const { Id } = req.params;
    const post = await Post.findById(Id);
  if(!post){
    return res.status(404).json({
      success:false,
      message:"post not found"
    })
  }
  const UserId  =   req.id;
  console.log("loggedIn user" ,UserId );
  
  const isLiked = post.likes.includes(UserId);
   if(isLiked){
    post.likes = post.likes.filter((id) => id.toString() !== UserId.toString());
    await post.save();
    return res.status(200).json({
      success: true,
      message: 'Post disliked successfully.',
      post
    });
   } else {
    post.likes.push(UserId);
    await post.save();
    return res.status(200).json({
      success: true,
      message: 'Post liked successfully.',
      post
    });
   }
  } catch (error) {
    console.error('Like and Dislike Post Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }

}
export const GetMyPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.id })
      .populate('author', 'name username profilePic')
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Get User Posts Error:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
