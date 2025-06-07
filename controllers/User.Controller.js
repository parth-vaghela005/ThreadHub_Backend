
import User  from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinary } from "../utility/cloudinary.js";
dotenv.config();
export const  CreateUser = async (req, res) => {
 try {
    const {name,username,email,password}  = req.body;
    if(!name || !username || !email || !password){
        return res.status(200).json({
            success:false,
            message:"All field are required"
        }) }
        const AlreadyExist  = await User.findOne({$or:[{username},{email}]})
        if (AlreadyExist)  return res.status(400).json({ success: false, message: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedpassword  = await bcrypt.hash(password, salt);
        
        const formattedName = name.trim().split(" ").map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join("+");
        
        const avatarURL = `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=ffffff&bold=true&rounded=true&size=128`;
        const newUser = new User({ name, username, email, password:hashedpassword  , profilePic:avatarURL});
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully", user: newUser });  
 } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
 }
}
export const LoginUser = async (req, res) => {
try {
    const {based, password} = req.body;
        if (!password || !based) {
            return res.status(400).json({
            error: 'All fields are required',
            });
        }
    const user   = await User.findOne({$or:[{username : based},{email:based}]})
    if (!user) {
        return res.status(400).json({
            success:false,
            message:"please create account"
        })
    }
    const ismathced  = await bcrypt.compare(password, user.password);
    if (!ismathced) {
        return res.status(400).json({
            success:false,
            message:"incorrect passsword "
        })
    }
    const token  = jwt.sign({ id:user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    console.log(token , "token");
    
   return  res.status(200).cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, 
  }).json({
        success: true,
        message: "Login successfully",
        user,
    })
} catch (error) {   
    return res.status(500).json({
        success:false,
        message:"internal server error",
        error:error.message
    })
}
}
export const Logout = async (req, res) => {
    try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        message: "Logged out successfully.",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to logout",
      });
    }
  };

export const GetUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'author',
            select: 'name username profilePic'
          },
          {
            path: 'likes',
            select: 'name username profilePic'
          },
          {
            path: 'comments', // only if Comment model exists
            // Add nested population inside comments if needed
          }
        ]
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const EditProfile = async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    const userId = req.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim() || '',
        bio: bio?.trim() || '',
        location: location?.trim() || ''
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("updated"  , updatedUser);
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getRandomSuggestions = async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 3;

    const users = await User.aggregate([
      { $sample: { size } },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          profilePic: 1,
        },
      },
    ]);
    res.json(users);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const toggleFollow = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const userIdToFollow = req.params.userId;
    if (loggedInUserId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
    const userToFollow = await User.findById(userIdToFollow);
    const loggedInUser = await User.findById(loggedInUserId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found." });
    }
    const isFollowing = userToFollow.followers.includes(loggedInUserId);
    if (isFollowing) {
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== loggedInUserId.toString()
      );
      loggedInUser.following = loggedInUser.following.filter(
        id => id.toString() !== userIdToFollow.toString()
      );
      await userToFollow.save();
      await loggedInUser.save();
      return res.status(200).json({ message: "User unfollowed successfully." });
    } else {
      userToFollow.followers.push(loggedInUserId);
      loggedInUser.following.push(userIdToFollow);
      await userToFollow.save();
      await loggedInUser.save();
      return res.status(200).json({ message: "User followed successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
