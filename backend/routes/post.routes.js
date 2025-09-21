import { Router } from "express";
import { activeCheck, commentPost, createPost, deleteComment, deletePost, likePost } from "../controllers/post.controller.js";
import multer from "multer";
import { getAllPOsts } from "../controllers/post.controller.js";


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

router.route("/all_posts").get(getAllPOsts);

router.route("/delete_post").post(deletePost);

router.route("/add_comment").post(commentPost);

router.route("/delete_comment_for_post").post(deleteComment);

router.route("/like_post").post(likePost);














export default router;
