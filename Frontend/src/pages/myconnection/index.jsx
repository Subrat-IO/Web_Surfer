import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config/axiosInstance";
import styles from "./style.module.css";
import {
  getMyconnections,
  getConnectionRequest,
  acceptConnections,
  deleteConnection,
  getAboutUser,
} from "@/config/redux/actions/authAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";

function MyConnectionPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [token, setToken] = useState(null);

  const loggedInUserId = authState?.users?._id;

  // ✅ Read token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
      if (t) {
        dispatch(getAboutUser({ token: t }));
        dispatch(getMyconnections({ token: t }));
        dispatch(getConnectionRequest({ token: t }));
      }
    }
  }, [dispatch]);

  const allConnections = authState?.allConnections || [];

  // Normalize userId and connectionId for consistent access
  const normalizedConnections = allConnections.map((c) => ({
    ...c,
    userId: typeof c.userId === "string" ? c.userId : c.userId?._id,
    connectionId:
      typeof c.connectionId === "string"
        ? c.connectionId
        : c.connectionId?._id || c.connectionId,
  }));

  // Split categories
  const acceptedConnections = normalizedConnections.filter(
    (c) => c.status_accepted === true
  );
  const incomingRequests = normalizedConnections.filter(
    (c) => !c.status_accepted && c.connectionId === loggedInUserId
  );
  const sentRequests = normalizedConnections.filter(
    (c) => !c.status_accepted && c.userId === loggedInUserId
  );

  // Handlers
  const handleAccept = (conn) => {
    dispatch(
      acceptConnections({
        token,
        requestId: conn._id,
        connectionId: conn.userId,
        action: "accept",
      })
    );
  };

  const handleReject = (conn, type) => {
    dispatch(
      deleteConnection({
        token,
        requestId: conn._id,
        connectionId: type === "incoming" ? conn.userId : conn.connectionId,
        action: "reject",
      })
    );
  };

  const handleRemoveConnection = (conn) => {
    dispatch(
      deleteConnection({
        token,
        connectionId: conn.connectionId || conn.userId,
      })
    );
  };

  // Connection card
  const ConnectionCard = ({ conn, type }) => {
    const name =
      conn.connectionIdName || conn.connectionId?.name || conn.userId?.name;
    const username =
      conn.connectionIdUsername ||
      conn.connectionId?.username ||
      conn.userId?.username;
    const profilePic =
      conn.connectionIdProfile ||
      conn.connectionId?.profilePicture ||
      conn.userId?.profilePicture ||
      `${BASE_URL}/uploads/default.jpg`;

    return (
      <div
        className={`${styles.card} ${
          type === "accepted"
            ? styles.accepted
            : type === "incoming"
            ? styles.incoming
            : styles.sent
        }`}
      >
        <div className={styles.cardContent}>
          <img src={profilePic} alt="profile" className={styles.profilePic} />
          <div className={styles.userInfo}>
            <h3>{name}</h3>
            <p>@{username}</p>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          {type === "accepted" && (
            <button
              onClick={() => handleRemoveConnection(conn)}
              className={`${styles.button} ${styles.red}`}
            >
              Remove 🗑️
            </button>
          )}
          {type === "incoming" && (
            <>
              <button
                onClick={() => handleAccept(conn)}
                className={`${styles.button} ${styles.green}`}
              >
                Accept ✅
              </button>
              <button
                onClick={() => handleReject(conn, "incoming")}
                className={`${styles.button} ${styles.red}`}
              >
                Reject ❌
              </button>
            </>
          )}
          {type === "sent" && (
            <button
              onClick={() => handleReject(conn, "sent")}
              className={`${styles.button} ${styles.red}`}
            >
              Cancel ❌
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>My Connections</h1>

          {/* Accepted */}
          <section>
            <h2 className={`${styles.sectionTitle} ${styles.greenText}`}>
              ✅ My Connections
            </h2>
            {acceptedConnections.length > 0 ? (
              acceptedConnections.map((c) => (
                <ConnectionCard key={c._id} conn={c} type="accepted" />
              ))
            ) : (
              <p className={styles.emptyText}>No connections yet.</p>
            )}
          </section>

          {/* Incoming */}
          <section>
            <h2 className={`${styles.sectionTitle} ${styles.yellowText}`}>
              📬 Incoming Requests
            </h2>
            {incomingRequests.length > 0 ? (
              incomingRequests.map((c) => (
                <ConnectionCard key={c._id} conn={c} type="incoming" />
              ))
            ) : (
              <p className={styles.emptyText}>No incoming requests.</p>
            )}
          </section>

          {/* Sent */}
          <section>
            <h2 className={`${styles.sectionTitle} ${styles.blueText}`}>
              📤 Sent Requests
            </h2>
            {sentRequests.length > 0 ? (
              sentRequests.map((c) => (
                <ConnectionCard key={c._id} conn={c} type="sent" />
              ))
            ) : (
              <p className={styles.emptyText}>No sent requests.</p>
            )}
          </section>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default MyConnectionPage;
