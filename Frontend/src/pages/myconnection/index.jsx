import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import {
  getConnectionRequest,
  getMyconnections,
  acceptConnections,
  deleteConnection,
} from "@/config/redux/actions/authAction";

export default function MyConnectionPage() {
  const dispatch = useDispatch();

  const { allConnections, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getConnectionRequest({ token }));
      dispatch(getMyconnections({ token }));
    }
  }, [dispatch, token]);

  const handleAcceptReject = (connection, action) => {
    dispatch(
      acceptConnections({
        token,
        requestId: connection._id,
        connectionId: connection.connectionId || connection.userId._id,
        action,
      })
    );
  };

  const handleDelete = (connection) => {
    dispatch(
      deleteConnection({
        token,
        connectionId: connection.connectionId || connection.userId._id,
        requestId: connection._id,
      })
    );
  };

  return (
    <UserLayout>
      <DashBoardLayout>
        <div style={{ padding: "20px" }}>
          <h2>My Connections</h2>
          {allConnections.length === 0 && <p>No connections found.</p>}
          <div>
            {allConnections.map((conn) => {
              const isIncoming = !conn.status_accepted && conn.connectionId === token;
              const user = conn.userId || conn.connectionId;

              return (
                <div
                  key={conn._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {conn.status_accepted ? "Accepted" : "Pending"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {!conn.status_accepted && conn.userId && (
                      <>
                        <button
                          onClick={() => handleAcceptReject(conn, "accept")}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "green",
                            color: "#fff",
                            borderRadius: "4px",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAcceptReject(conn, "reject")}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "red",
                            color: "#fff",
                            borderRadius: "4px",
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(conn)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "gray",
                        color: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
