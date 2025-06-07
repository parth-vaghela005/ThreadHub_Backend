import express from "express";
import {CreateUser, LoginUser  , Logout ,GetUser , EditProfile, getRandomSuggestions, toggleFollow } from '../controllers/User.Controller.js'
import { CreatePost, GetAllPosts } from "../controllers/Post.Controller.js";
import upload from "../middlewares/upload.js";
import Auth  from "../middlewares/Auth.js";
const router = express.Router();
router.post('/regestration', CreateUser)
router.post('/login', LoginUser)
router.post('/create',Auth,upload.single('file'),CreatePost)
router.get('/getAll', GetAllPosts)
router.get('/logout', Logout)
router.get('/user/:username', GetUser)
router.patch("/profile/edit", Auth,  EditProfile);
router.get('/suggestion',getRandomSuggestions)   
router.post('/:userId/followUnfollow', Auth, toggleFollow);
export default router;