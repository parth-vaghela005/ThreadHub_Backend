import express from 'express';
import { AddComment, getPostById, LikeAndDislikePost , GetAllPosts , GetMyPost} from '../controllers/Post.Controller.js';
import Auth from '../middlewares/Auth.js';
const router = express.Router();
router.get('/myposts', Auth, GetMyPost)
router.get('/:Id', Auth,getPostById);
router.post("/:Id/comment", Auth, AddComment);
router.post("/:Id/Like", Auth, LikeAndDislikePost);
router.get("/" ,GetAllPosts)

export default router

