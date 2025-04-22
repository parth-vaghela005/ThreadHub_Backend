
import User  from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
        const newUser = new User({ name, username, email, password:hashedpassword });
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
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, 
      })
    res.status(200).json({
        success:true,
        message:"login successfully",
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