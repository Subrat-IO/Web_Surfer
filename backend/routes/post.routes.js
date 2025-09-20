import { Router } from "express";
import { activeCheck, createPost } from "../controllers/post.controller.js";
import multer from "multer";
import { getAllPOsts } from "../controllers/post.controller.js";











const router = Router();


const storage  = multer.diskStorage({
    destination:(req, file , cb) =>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) =>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})



router.route("/nm", activeCheck);
 
router.route("/post").post(upload.single('media'), createPost);

router.route("/posts").get(getAllPOsts); 


 





export default router;
