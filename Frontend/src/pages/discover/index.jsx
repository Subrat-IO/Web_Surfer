import { getAllUsers } from "@/config/redux/actions/authAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }
  }, [authState.allProfileFetched, dispatch]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.discoverContainer}>
          <h1 className={styles.pageTitle}>Discover</h1>

          {!authState.allProfileFetched ? (
            <p className={styles.loadingText}>Loading profiles...</p>
          ) : (
            <div className={styles.gridContainer}>
              {authState.all_users?.map((profile) => (
                <div key={profile._id} className={styles.userCard}>
                  <h2 className={styles.userName}>
                    {profile.userId?.name}
                  </h2>
                  <p className={styles.username}>
                    @{profile.userId?.username}
                  </p>
                  <button
                    className={styles.seeProfileButton}
                    onClick={() =>
                      router.push(`/viewProfile/${profile.userId?.username}`)
                    }
                  >
                    See Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
