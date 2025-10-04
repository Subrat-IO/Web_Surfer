import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/config/redux/actions/authAction";
import { BASE_URL } from "@/config/axiosInstance";

function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const userProfile = authState?.users?.userId;
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <header className={styles.navbar}>
      <div className={styles.logo} onClick={() => router.push("/")}>
        Talent<span>Mesh</span>
      </div>

      {authState.profilefetched ? (
        <div className={styles.profileSection}>
          <div
            className={styles.profileContainer}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={`${BASE_URL}/uploads/${userProfile?.profilepicture || "default.png"}`}
              alt={userProfile?.name}
              className={styles.profileImage}
            />
            <span className={styles.userName}>
              Hey, {authState.users?.userId?.name || "User"}
            </span>
          </div>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <p onClick={() => router.push("/MyProfile")}>Your Profile</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button onClick={() => router.push("/login")}>Be a part</button>
        </div>
      )}
    </header>
  );
}

export default NavbarComponent;
