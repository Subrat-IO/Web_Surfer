import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/config/redux/actions/authAction";
import { BASE_URL } from "@/config/axiosInstance"; // <-- make sure you have this action

function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const userProfile = authState?.users?.userId;

  useEffect(() => {
    if (
      authState.profilefetched &&
      (router.pathname === "/login" || router.pathname === "/register")
    ) {
      router.push("/dashboard");
    }
  }, [authState.profilefetched, router]);




  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };


  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          TalentMesh
        </h1>

        {authState.profilefetched ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#f5f7fa",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          >
            <img
              src={`${BASE_URL}/uploads/${userProfile?.profilepicture || "default.png"}`}
              alt={userProfile?.name}
              className={styles.profileImage}
            />
            <p
              style={{ margin: 0, fontWeight: 600, color: "#0070f3" }}
            >
              Hey, {authState.users?.userId?.name || "User"}
            </p>
            <p className={styles.ViewProfilePage} onClick={()=>{
              router.push('/MyProfile')
            }}
              style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}
            >
              Your Profile
            </p>


            <button
              onClick={handleLogout}
              style={{
                padding: "6px 10px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.navBarOptionContainer}>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavbarComponent;
