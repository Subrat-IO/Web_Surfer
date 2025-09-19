import { activeCheck } from "../controllers/post.controller.js";
import { login, register, updateProfileData, UserProfile,getAllUserProfile, download_profile } from "../controllers/user.controller.js";
import { Router } from "express";
import multer from "multer";
import { uploadProfilePicture , updateUserProfile   } from "../controllers/user.controller.js";

const router = Router();

const storage =  multer.diskStorage({   
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname);
    }
})


const upload = multer({ storage: storage });

router.route("/update_profile_picture")
.post(upload.single('profile_picture'), updateUserProfile); 


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(UserProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(download_profile);
router.route("/user/send_request")


export default router;
 
 