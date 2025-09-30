import User from "../models/user.models.js";
import bcrypt, { hash } from "bcrypt";
import Post from "../models/post.models.js";
import Comment from "../models/comments.models.js";

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


export const getAllPosts = async (req, res) => {
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

        await Post.deleteOne({ _id: post_id });

        return res.status(500).json({ message: "Post Deleted" });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    // Find user by token (since you don't use JWT)
    const user = await User.findOne({ token }).select("_id name username profilepicture");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find post
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Save comment
    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await comment.save();

    return res.status(201).json({
      message: "Comment added",
      comment: {
        _id: comment._id,
        body: comment.body,
        userId: {
          _id: user._id,
          name: user.name,
          username: user.username,
          profilepicture: user.profilepicture,
        },
        createdAt: comment.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query; // or req.body if you use POST

  try {
    // Find all comments for this post
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "name username profilepicture"
    );

    // Format comments for frontend
    const formattedComments = comments.map((c) => ({
      _id: c._id,
      body: c.body,
      user: {
        _id: c.userId._id,
        name: c.userId.name,
        username: c.userId.username,
        profilepicture: c.userId.profilepicture,
      },
      createdAt: c.createdAt,
    }));

    return res.status(200).json({ comments: formattedComments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


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
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Toggle like by user if you have userId
    // For now, just increment
    post.likes = (post.likes || 0) + 1;

    await post.save();

    // Return updated post likes
    return res.status(200).json({ post_id: post._id, likes: post.likes });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
