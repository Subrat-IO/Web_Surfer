import React from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function DashBoardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      {/* Home container: left sidebar + feed */}
      <div className={styles.homeContainer}>
        {/* Left Sidebar */}
        <div className={styles.leftBar}>
          <div
            className={styles.menuItem}
            onClick={() => router.push("/dashboard")}
          >
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className={styles.menuText}>Scroll</span>
          </div>

          <div
            className={styles.menuItem}
            onClick={() => router.push("/discover")}
          >
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <span className={styles.menuText}>Discover</span>
          </div>

          <div
            className={styles.menuItem}
            onClick={() => router.push("/myconnection")}
          >
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            <span className={styles.menuText}>My Connections</span>
          </div>
        </div>

        {/* Feed Section */}
        <div className={styles.feedContainer}>{children}</div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.extraContainer}>
        <h3>Top Profiles</h3>
        {authState.allProfileFetched && authState.all_users?.length > 0 ? (
          authState.all_users.map((profile) => (
            <div
              onClick={() =>
                router.push(`/viewProfile/${profile.userId?.username}`)
              }
              key={profile._id}
              className={styles.extraContainer__profile}
            >
              <p>{profile.userId?.name || "No Name"}</p>
            </div>
          ))
        ) : (
          <p>Loading profiles...</p>
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className={styles.bottomNav}>
        <div
          className={styles.bottomNavItem}
          onClick={() => router.push("/dashboard")}
        >
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>

        <div
          className={styles.bottomNavItem}
          onClick={() => router.push("/discover")}
        >
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <div
          className={styles.bottomNavItem}
          onClick={() => router.push("/myconnection")}
        >
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DashBoardLayout;
