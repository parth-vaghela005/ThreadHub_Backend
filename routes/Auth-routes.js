import express from "express";
import {CreateUser} from '../controllers/User.Controller.js'
import { CreatePost, GetAllPosts } from "../controllers/Post.Controller.js";
import upload from "../middlewares/upload.js";
const router = express.Router();
router.post('/regestration', CreateUser)
router.post('/create',upload.single('file'),CreatePost)
router.get('/getAll', GetAllPosts)
export default router;