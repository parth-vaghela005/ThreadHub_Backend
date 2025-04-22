import express from "express";
import {CreateUser, LoginUser  , Logout} from '../controllers/User.Controller.js'
import { CreatePost, GetAllPosts } from "../controllers/Post.Controller.js";
import upload from "../middlewares/upload.js";
import Auth  from "../middlewares/Auth.js";
const router = express.Router();
router.post('/regestration', CreateUser)
router.post('/login', LoginUser)
router.post('/create',Auth,upload.single('file'),CreatePost)
router.get('/getAll', GetAllPosts)
router.get('/logout', Logout)
export default router;