import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.module.css"; // Create this CSS module
import { getAboutUser } from "@/config/redux/actions/authAction";

function MyProfile() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
      if (t) dispatch(getAboutUser({ token: t }));
    }
  }, [dispatch]);

  const user = authState?.users;

  if (!user) return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <img
          src={user.profilePicture || "/uploads/default.jpg"}
          alt="Profile"
          className={styles.profilePic}
        />
        <div className={styles.userInfo}>
          <h1>{user.name}</h1>
          <p>@{user.username}</p>
          <p>{user.email}</p>
        </div>
      </div>

      <div className={styles.details}>
        <h2>About Me</h2>
        <p>{user.bio || "This user hasn't added a bio yet."}</p>
      </div>

      <div className={styles.stats}>
        <div>
          <h3>{authState?.allConnections?.filter(c => c.status_accepted).length || 0}</h3>
          <p>Connections</p>
        </div>
        <div>
          <h3>{authState?.allConnections?.filter(c => !c.status_accepted && c.connectionId._id === user._id).length || 0}</h3>
          <p>Incoming Requests</p>
        </div>
        <div>
          <h3>{authState?.allConnections?.filter(c => !c.status_accepted && c.userId === user._id).length || 0}</h3>
          <p>Sent Requests</p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
