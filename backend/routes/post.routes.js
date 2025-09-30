import { Router } from "express";
import { activeCheck, commentPost, createPost, deleteComment, deletePost, get_comments_by_post, likePost } from "../controllers/post.controller.js";
import multer from "multer";
import { getAllPosts } from "../controllers/post.controller.js";


const router = Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })



router.route("/nm", activeCheck);

router.route("/post").post(upload.single('media'), createPost);

router.route("/posts").get(getAllPosts);

router.route("/delete_post").delete(deletePost);

router.route("/add_comment").post(commentPost);

router.route("/get_comments").get(get_comments_by_post)

router.route("/delete_comment_for_post").post(deleteComment);

router.route("/like_post").post(likePost);














export default router;
