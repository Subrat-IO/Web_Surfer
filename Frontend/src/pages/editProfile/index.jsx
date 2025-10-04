import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";

export default function EditProfilePage({ profileData }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" }); // for inline messages

  // Initialize form data
  const [formData, setFormData] = useState({
    name: profileData?.userId?.name || "",
    username: profileData?.userId?.username || "",
    email: profileData?.userId?.email || "",
    bio: profileData?.bio || "",
    currentPost: profileData?.currentPost || "",
    education: profileData?.education || [],
    postWork: profileData?.postWork || [],
  });

  // Get token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle array fields (comma-separated input)
  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value.split(",").map((v) => v.trim()).filter((v) => v) });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ type: "error", message: "Token not found. Please login again." });
      return;
    }

    try {
      const payload = {
        token,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        currentPost: formData.currentPost,
        education: formData.education,
        postWork: formData.postWork,
      };

      const res = await fetch("http://localhost:9090/update_profile_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Profile updated successfully!" });
        // Redirect after 1 second
        setTimeout(() => router.push("/MyProfile"), 1000);
      } else {
        setStatus({ type: "error", message: data.message || "Update failed." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error: " + err.message });
    }
  };

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Edit Profile</h1>

            <div className={styles.inputGroup}>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>

           

            <div className={styles.inputGroup}>
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Current Post</label>
              <input type="text" name="currentPost" value={formData.currentPost} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Education (comma separated)</label>
              <input
                type="text"
                value={formData.education.join(", ")}
                onChange={(e) => handleArrayChange(e, "education")}
                placeholder="e.g. B.Tech, M.Tech"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Work Experience (comma separated)</label>
              <input
                type="text"
                value={formData.postWork.join(", ")}
                onChange={(e) => handleArrayChange(e, "postWork")}
                placeholder="e.g. Google - Developer"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Save Changes
            </button>

            {/* Inline Status Message */}
            {status.message && (
              <p
                className={
                  status.type === "success" ? styles.successMessage : styles.errorMessage
                }
                style={{ marginTop: "1rem" }}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
