import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { npmjsserver, BASE_URL } from "@/config/axiosInstance";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./styles.module.css";
import { getMyconnections } from "@/config/redux/actions/authAction";

export default function MyProfilePage() {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [latestPost, setLatestPost] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await npmjsserver.get("/get_user_and_profile", {
          params: { token: localStorage.getItem("token") },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile?.userId?._id) return;
    const fetchLatestPost = async () => {
      try {
        const res = await npmjsserver.get("/posts");
        const userPosts = res.data.posts
          .filter((p) => p.userId._id === profile.userId._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (userPosts.length) setLatestPost(userPosts[0]);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchLatestPost();
  }, [profile?.userId?._id]);

  useEffect(() => {
    if (!profile?.userId?._id) return;
    const fetchConnections = async () => {
      try {
        const updatedConnections = await dispatch(
          getMyconnections({ token: localStorage.getItem("token") })
        ).unwrap();
        setConnections(updatedConnections);
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, [profile?.userId?._id]);

  if (!profile) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className={styles.pfContainer}>
            <p className={styles.pfTextGray}>Loading your profile...</p>
          </div>
        </DashBoardLayout>
      </UserLayout>
    );
  }

  const user = profile.userId;

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.pfContainer}>
          <div className={styles.pfCard}>
            <div className={styles.pfBanner}></div>

            <div className={styles.pfHeader}>
              <div className={styles.pfImageCol}>
                <img
                  src={`${BASE_URL}/uploads/${user?.profilepicture || "default.jpg"}`}
                  alt={user?.name || "User"}
                  className={styles.pfAvatar}
                />

                <div
                  onClick={async () => {
                    try {
                      const response = await npmjsserver.get(
                        `/user/download_resume/?id=${user._id}`
                      );
                      window.open(`${BASE_URL}/uploads/${response.data.file}`, "_blank");
                    } catch (err) {
                      console.error("Error downloading resume:", err);
                    }
                  }}
                  className={styles.pfResumeBtn}
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

              <div className={styles.pfInfo}>
                <h1>{user?.name || "Your Name"}</h1>
                <p className={styles.pfUsername}>@{user?.username || "username"}</p>
                <p className={styles.pfHeadline}>
                  {profile?.headline || "Full Stack Developer | MERN | Open Source Enthusiast"}
                </p>
              </div>
            </div>

            <div className={styles.pfBody}>
              <div className={styles.pfSection}>
                <h2>Email</h2>
                <p>{user?.email || "your@email.com"}</p>
              </div>

              <div className={styles.pfSection}>
                <h2>Bio</h2>
                <p>{profile?.bio || "Tell people about yourself..."}</p>
              </div>

              <div className={styles.pfSection}>
                <h2>Current Post</h2>
                <p>{profile?.currentPost || "Software Engineer"}</p>
              </div>

              <div className={styles.pfSection}>
                <h2>Education</h2>
                {profile?.education?.length ? (
                  <ul>{profile.education.map((edu, i) => <li key={i}>{edu}</li>)}</ul>
                ) : (
                  <ul>
                    <li>B.Tech in Computer Science – NIT Rourkela</li>
                    <li>Certified AWS Cloud Practitioner</li>
                  </ul>
                )}
              </div>

              <div className={styles.pfSection}>
                <h2>Joined</h2>
                <p>{profile?.createdAt ? new Date(profile.createdAt).toDateString() : "Date not available"}</p>
              </div>

              <div className={styles.pfSection}>
                <h2>Connections</h2>
                <p>{connections?.length || 0} connections</p>
              </div>

              <div className={styles.pfSection}>
                <h2>Recent Activity</h2>
                {latestPost ? (
                  <ul className={styles.pfRecentList}>
                    <li className={styles.pfPost}>
                      <div className={styles.pfPostContent}>
                        <p className={styles.pfPostText}>{latestPost.body}</p>
                        {latestPost.media && (
                          <img
                            src={`${BASE_URL}/uploads/${latestPost.media}`}
                            alt="Post media"
                            className={styles.pfPostImage}
                          />
                        )}
                      </div>
                    </li>
                  </ul>
                ) : (
                  <p className={styles.pfTextGray}>No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
