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


export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;

    try {

        const user = await User.findOne({ token: token }).select("_id");

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const comment = new comment({
            userId: user._id,
            postId: post_id,
            comment: commentBody,
        });

        await comment.save();

        return res.status(200).json({ message: "comment added" });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const get_comments_by_post = async (req, res) => {
    const { post_id } = req.body;
    try {
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        return res.json({ comments: post.comments });
    }
    catch (err) {

        return res.status(500).json({ message: err.message });
    }
}

export const deleteComment = async (req, res) => {
    const { token, comment_id } = req.body;

    try {
        const user = await User.findOne({ token: token }).select("_id");


        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const comment = await comment.findOne({ postId: post_id });

        if (!comment) {
            return res.status(404).json({ message: "comment not found" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorised" });
        }

        await comment.deleteOne({ "_id": comment_id });

        return res.json({ message: "comment deleted" });

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


export const likePost = async (req, res) => {
    const { post_id } = req.body;

    try {
        const post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(404).json({ message: "post not found" });


        }

        post.likes = post.likes + 1;

        await post.save();

        return res.json({ message: "likes Increased" })
    }
    catch (err) {
        return res.status(500).json({ message: err.message });

    }

}