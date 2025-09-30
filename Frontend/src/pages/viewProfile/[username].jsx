import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { npmjsserver, BASE_URL } from "@/config/axiosInstance";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./style.module.css";
import { SendConnectionRequest, getMyconnections } from "@/config/redux/actions/authAction";

export default function ViewProfilePage({ profile }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const loggedInUser = authState?.users?.userId;
  const viewedUser = profile?.userId;

  const [latestPost, setLatestPost] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Fetch latest post
  useEffect(() => {
    if (!viewedUser?._id) return;

    const fetchLatestPost = async () => {
      try {
        const res = await npmjsserver.get("/posts");
        const userPosts = res.data.posts
          .filter((p) => p.userId._id === viewedUser._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (userPosts.length > 0) setLatestPost(userPosts[0]);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchLatestPost();
  }, [viewedUser?._id]);

  // Fetch connection status
  const fetchConnectionStatus = async () => {
    if (!loggedInUser?._id) return;
    try {
      const updatedConnections = await dispatch(
        getMyconnections({ token: localStorage.getItem("token") })
      ).unwrap();

      const outgoingRequest = updatedConnections.find(
        (c) => c.connectionId?._id === viewedUser._id
      );

      const incomingRequest = updatedConnections.find(
        (c) => c.userId === viewedUser._id && c.connectionId?._id === loggedInUser?._id
      );

      if (outgoingRequest) {
        setIsConnected(outgoingRequest.status_accepted === true);
        setIsPending(outgoingRequest.status_accepted === false);
      } else if (incomingRequest) {
        setIsConnected(incomingRequest.status_accepted === true);
        setIsPending(false);
      } else {
        setIsConnected(false);
        setIsPending(false);
      }
    } catch (err) {
      console.error("Error fetching connection status:", err);
    }
  };

  // Poll backend every 5s
  useEffect(() => {
    fetchConnectionStatus();
    const interval = setInterval(fetchConnectionStatus, 5000);
    return () => clearInterval(interval);
  }, [viewedUser?._id, loggedInUser?._id]);

  // Send connection request
  const handleConnectionToggle = async () => {
    if (!viewedUser?._id || isPending || isConnected) return;
    try {
      await dispatch(
        SendConnectionRequest({
          token: localStorage.getItem("token"),
          userId: viewedUser._id,
        })
      ).unwrap();
      fetchConnectionStatus();
    } catch (err) {
      console.error("Error sending connection request:", err);
    }
  };

  if (!profile) {
    return (
      <div className={styles.profileContainer}>
        <p className={styles.textGray}>Profile not found</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.profileContainer}>
          <div className={styles.profileCard}>
            <div className={styles.profileBanner}></div>

            <div className={styles.profileHeader}>
              <div className={styles.imageColumn}>
                <img
                  src={`${BASE_URL}/uploads/${viewedUser?.profilepicture || "default.jpg"}`}
                  alt={viewedUser?.name || "User"}
                  className={styles.profileImage}
                />
                <div className={styles.Buttons}>
                  {loggedInUser?._id !== viewedUser?._id && (
                    <button
                      onClick={handleConnectionToggle}
                      disabled={isPending || isConnected}
                      className={`${styles.connectButton} 
                        ${isConnected ? styles.disconnect : ""} 
                        ${isPending ? styles.pending : styles.connect}`}
                    >
                      {isConnected ? "Connected" : isPending ? "Pending..." : "Send Connection"}
                    </button>
                  )}

                  {/* Download Resume Button */}
                  <div
                    onClick={async () => {
                      try {
                        const response = await npmjsserver.get(
                          `/user/download_resume/?id=${profile.userId._id}`
                        );
                        window.open(`${BASE_URL}/uploads/${response.data.file}`, "_blank");
                      } catch (err) {
                        console.error("Error downloading resume:", err);
                      }
                    }}
                    className={styles.DownloadResume}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    <p>Resume</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileInfo}>
                <h1>{viewedUser?.name || "John Doe"}</h1>
                <p className={styles.username}>@{viewedUser?.username || "johndoe"}</p>
                <p className={styles.headline}>
                  {profile?.headline || "Full Stack Developer | MERN | Open Source Enthusiast"}
                </p>
              </div>
            </div>

            <div className={styles.profileBody}>
              <div className={styles.profileSection}>
                <h2>Email</h2>
                <p>{viewedUser?.email || "johndoe@example.com"}</p>
              </div>

              <div className={styles.profileSection}>
                <h2>Bio</h2>
                <p>{profile?.bio || "Passionate developer with experience in React, Node.js, and cloud platforms."}</p>
              </div>

              <div className={styles.profileSection}>
                <h2>Current Post</h2>
                <p>{profile?.currentPost || "Software Engineer at NextGen Tech"}</p>
              </div>

              <div className={styles.profileSection}>
                <h2>Education</h2>
                {profile?.education?.length > 0 ? (
                  <ul>{profile.education.map((edu, i) => <li key={i}>{edu}</li>)}</ul>
                ) : (
                  <ul>
                    <li>B.Tech in Computer Science – NIT Rourkela</li>
                    <li>Certified AWS Cloud Practitioner</li>
                  </ul>
                )}
              </div>

              <div className={styles.profileSection}>
                <h2>Joined</h2>
                <p>{profile?.createdAt ? new Date(profile.createdAt).toDateString() : "January 5, 2022"}</p>
              </div>

              <div className={styles.profileSection}>
                <h2>Recent Activity</h2>
                {latestPost ? (
                  <ul className={styles.recentActivityList}>
                    <li className={styles.postItem}>
                      <div className={styles.postContent}>
                        <p className={styles.postText}>{latestPost.body}</p>
                        {latestPost.media && (
                          <img
                            src={`${BASE_URL}/uploads/${latestPost.media}`}
                            alt="Post media"
                            className={styles.postImage}
                          />
                        )}
                      </div>
                    </li>
                  </ul>
                ) : (
                  <p className={styles.textGray}>No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

// Server Side Rendering
export async function getServerSideProps(context) {
  const { username } = context.params;

  try {
    const request = await npmjsserver.get("/user/getprofilefrom_username", {
      params: { username },
    });
    return { props: { profile: request.data.profile || null } };
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return { props: { profile: null } };
  }
}
