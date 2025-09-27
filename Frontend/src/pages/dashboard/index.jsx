import { getAllPosts, createPost, deletePost } from "@/config/redux/actions/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/actions/authAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./style.module.css";
import { BASE_URL } from "@/config/axiosInstance";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

    const postState = useSelector((state) => state.posts);
    const authState = useSelector((state) => state.auth);

    const [isTokenThere, setIsTokenThere] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [postContent, setPostContent] = useState("");

    // Check token on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            setIsTokenThere(true);
        }
    }, [router]);

    // Fetch posts and user data
    useEffect(() => {
        if (!isTokenThere) return;

        const token = localStorage.getItem("token");
        if (token) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token }));
        }
        if (!authState.allProfileFetched) {
            dispatch(getAllUsers());
        }
    }, [isTokenThere, dispatch, authState.allProfileFetched]);

    if (!isTokenThere) return <div>Loading...</div>;

    const userProfile = authState?.users?.userId;

    if (!userProfile) {
        return <div>Loading user data...</div>;
    }

    // Create Post
    const handleUpload = () => {
        if (!postContent.trim() && !fileContent) return;

        const token = localStorage.getItem("token");
        dispatch(createPost({ token, file: fileContent, body: postContent }))
            .then(() => dispatch(getAllPosts()));

        setPostContent("");
        setFileContent(null);
    };

    // Delete Post
    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = localStorage.getItem("token");
            await dispatch(deletePost({ token, post_id: postId }));
            dispatch(getAllPosts());
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.dashboardContainer}>
                    {/* Create Post Card */}
                    <div className={styles.createPostCard}>
                        <div className={styles.currentUser}>
                            <img
                                src={`${BASE_URL}/uploads/${userProfile?.profilepicture || "default.png"}`}
                                alt={userProfile?.name || "User"}
                                className={styles.profileImage}
                            />
                            <p className={styles.userName}>{userProfile?.name || "User"}</p>
                        </div>

                        <textarea
                            className={styles.textarea}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="What's on your mind?"
                        />

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="fileUpload"
                            style={{ display: "none" }}
                            onChange={(e) => setFileContent(e.target.files[0])}
                        />

                        {/* Upload / Post Buttons */}
                        <div className={styles.postActionsTop}>
                            <div
                                className={styles.FileButton}
                                onClick={() => document.getElementById("fileUpload").click()}
                            >
                                <button className={styles.Fab}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                                <p className={styles.FabText}>Upload</p>
                            </div>

                            {(postContent.trim().length > 0 || fileContent) && (
                                <button className={styles.FileButton} onClick={handleUpload}>
                                    Post
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className={styles.postContainer}>
                        {postState.isLoading && <p className="text-center text-gray-500">Loading posts...</p>}
                        {postState.isError && <p className="text-center text-red-500">{postState.message}</p>}
                        {postState.posts.length === 0 && !postState.isLoading && (
                            <p className="text-center text-gray-400">No posts yet.</p>
                        )}

                        {postState.posts
                            .slice()
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((post) => (
                                <div key={post._id} className={styles.singlePost}>
                                    {/* Post Header */}
                                    <div className={styles.postHeader}>
                                        <img
                                            src={`${BASE_URL}/uploads/${userProfile?.profilepicture || "default.png"}`}
                                            alt={userProfile?.name}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.userInfo}>
                                            <div className={styles.userContainer}>
                                                <p className={styles.userName}>{post.userId?.name || "User"}</p>
                                                {userProfile?._id === post.userId?._id && (
                                                    <button
                                                        className={styles.deleteButton}
                                                        aria-label="Delete post"
                                                        onClick={() => handleDelete(post._id)}
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                )}
                                            </div>

                                            <p className={styles.username}>@{post.userId?.username || "user"}</p>
                                            <time className={styles.postTime}>
                                                {new Date(post.createdAt).toLocaleString()}
                                            </time>
                                        </div>

                                    </div>

                                    {/* Post Body */}
                                    {post.body && <p className={styles.postBody}>{post.body}</p>}

                                    {/* Post Media */}
                                    {post.media && (
                                        <img
                                            src={`${BASE_URL}/uploads/${post.media}`}
                                            alt="post media"
                                            className={styles.postMedia}
                                            loading="lazy"
                                        />
                                    )}

                                    {/* Post Actions */}
                                    <div className={styles.postActions}>
                                        <button className={styles.likeButton} aria-label="Like post">
                                            ❤️ {Array.isArray(post.likes) ? post.likes.length : post.likes || 0}
                                        </button>
                                        <button className={styles.commentButton} aria-label="Comment on post">
                                            💬 Comment
                                        </button>

                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    );
}
