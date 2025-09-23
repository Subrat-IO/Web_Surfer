import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { loginUser } from '@/config/redux/actions/authAction';


function loginComponent() {
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)
    const router = useRouter();

    const [isLoginMethod, setIsLoginMethod] = useState(false);
    useEffect(() => {
        if (authState.loggedIn) {
            router.push("/dashboard")
        }
    })

    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();
    const [username, setUsername] = useState();
    const [name, setName] = useState();



    const headingText = isLoginMethod ? "Sign In" : "Sign Up";

    const handleRegister = () => {
        console.log("registering you");

        dispatch(loginUser({}))

    }

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.cardContainer}>

                    <div className={styles.cardContainer_left}>
                        <p className={styles.cardLeftheading}>{headingText}</p>
                        <div className={styles.inputContainers}>
                            <div className={styles.inputRow}>
                                <input className={styles.inputField} placeholder='username' type="text" />
                                <input className={styles.inputField} placeholder='Name' type="text" />

                            </div>
                            <input className={styles.inputField} placeholder='Email' type="text" />
                            <input className={styles.inputField} placeholder='Password ' type="text" />

                            <div onClick={() => {
                                if (isLoginMethod) {

                                }
                                else {
                                    handleRegister();
                                }
                            }} className={styles.buttonWithOutline}>
                                SignUp
                            </div>
                        </div>


                    </div>

                    <div className={styles.cardContainer_right}>

                    </div>

                </div>
            </div>
        </UserLayout >
    )
}

export default loginComponent;