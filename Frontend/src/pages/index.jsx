import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
      <div className={`${styles.container} ${geistSans.variable}`}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with friends without exaggerations</p>
            <p>No social media platform, with stories no bluffs!</p>


            <div className={styles.buttonJoin} onClick={() => {
              router.push("/login")
            }}>
              <p>Join Now</p>
            </div>
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
