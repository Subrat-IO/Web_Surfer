import Image from "next/image";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAboutUser } from "@/config/redux/actions/authAction";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Fetch user info if token exists
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !authState.profilefetched) {
      dispatch(getAboutUser({ token })).finally(() => setLoading(false));
    } else {
      setLoading(false); // No token → not logged in
    }
  }, [dispatch, authState.profilefetched]);

  if (loading) {
    return <UserLayout><div>Loading...</div></UserLayout>; // Optional loading placeholder
  }

  return (
    <UserLayout>
      <div className={`${styles.container} ${geistSans.variable}`}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with friends without exaggerations</p>
            <p>No social media platform, with stories no bluffs!</p>

            {!authState?.user? (
              <div
                className={styles.buttonJoin}
                onClick={() => router.push("/login")}
              >
                <p>Explore</p>
              </div>
            ) : (
              <div
                className={styles.buttonJoin}
                onClick={() => router.push("/dashboard")}
              >
                <p>Explore</p>
              </div>
            )}
          </div>

          <div className={styles.mainContainer_right}>
            <Image
              src="/images/HomeConnection.jpg"
              alt="Home Connection"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
