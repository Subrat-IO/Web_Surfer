import User from "../models/user.models.js";
import bcrypt, { hash } from "bcrypt";
import Post from "../models/post.models.js";


export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: "running" });

}


export const createPost = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const post = new Post({
            userId: user._id,
            ...req.body,
            media: req.file != undefined ? req.file.filename : "",
            filetypes: req.file != undefined ? req.file.mimetype.split("/") : "",



        })

        await post.save();

        return res.status(200).json({ message: "post created" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}


export const getAllPOsts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name username email profilePicture')
        return res.json({ posts });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;
    try {

        const user = await User.findOne({ token: token })
            .select("_id");


        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorised Token" });
        }

        await Post.deletePost({ _id: post_id });

        return res.status(500).json({ message: "Post Deleted" });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });

    }
}