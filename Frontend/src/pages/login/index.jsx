import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/actions/authAction";

function LoginComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  const [isLoginMethod, setIsLoginMethod] = useState(true); // true = login, false = register
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  const handleRegister = () => {
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {/* Left & Right card */}
          <div className={styles.cardContainer_left}>
            {/* Slider Container */}
            <div className={styles.formSlider}>
              <div
                className={`${styles.formSlide} ${isLoginMethod ? styles.loginActive : styles.registerActive
                  }`}
              >
                {/* ---------------- Login Form ---------------- */}
                <div className={styles.formContent}>
                  <p className={styles.cardLeftheading}>Sign In</p>

                  <p style={{ color: authState.isError ? "red" : "green" }}>
                    {typeof authState.message === "string"
                      ? authState.message
                      : authState.message?.message}
                  </p>

                  <div className={styles.inputContainers}>
                    <input
                      type="email"
                      placeholder="Email"
                      className={styles.inputField}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className={styles.inputField}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div
                      onClick={handleLogin}
                      className={styles.buttonWithOutline}
                      style={{
                        opacity: authState.loading ? 0.6 : 1,
                        pointerEvents: authState.loading ? "none" : "auto",
                      }}
                    >
                      Sign In
                    </div>

                    <p
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => setIsLoginMethod(false)}
                    >
                      Create new account
                    </p>
                  </div>
                </div>

                {/* ---------------- Register Form ---------------- */}
                <div className={styles.formContent}>
                  <p className={styles.cardLeftheading}>Sign Up</p>

                  <p style={{ color: authState.isError ? "red" : "green" }}>
                    {typeof authState.message === "string"
                      ? authState.message
                      : authState.message?.message}
                  </p>

                  <div className={styles.inputContainers}>
                    <div className={styles.inputRow}>
                      <input
                        type="text"
                        placeholder="Username"
                        className={styles.inputField}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Name"
                        className={styles.inputField}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Email"
                      className={styles.inputField}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className={styles.inputField}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div
                      onClick={handleRegister}
                      className={styles.buttonWithOutline}
                      style={{
                        opacity: authState.loading ? 0.6 : 1,
                        pointerEvents: authState.loading ? "none" : "auto",
                      }}
                    >
                      Sign Up
                    </div>

                    <p
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => setIsLoginMethod(true)}
                    >
                      Already have an account?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (optional background/gradient) */}
          <div className={styles.cardContainer_right}>
            <div >
              <img className={styles.imageContainer_right} src="/images/HeyHi.png" alt="" />
              <h3>
                {isLoginMethod ? "Hey Please Sign In to Continue" : "Sign Up to Create an Account"}
              </h3>
            </div>


          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
