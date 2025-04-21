
import User  from "../models/User.model.js";
import bcrypt from "bcryptjs";
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
        res.status(201).json({ message: "User created successfully", user: newUser });  
 } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
 }
}