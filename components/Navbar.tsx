'use client'

import React from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/navigation";

const Navbar = () => {
    let token: string | null = null;
    if (window != undefined)
        token = window.localStorage.getItem('token')
    else token = null
    const router = useRouter();

    const Logout = () => {
        window.localStorage.removeItem('token')
        router.push('/client/login')
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                {/* Логотип */}
                <div className={styles.logo}>
                    <Link href="/">
                        <img
                            width={80}
                            src="https://t3.ftcdn.net/jpg/03/24/30/24/360_F_324302474_PPtpdsBgyhJjxCaWXDwrOzdlYRlPmIh2.jpg"
                            alt="logo"
                        />
                    </Link>
                </div>

                {/* Центр - "Афіша" як активна кнопка */}
                <Link href="/client/program" className={styles.menuItem}>
                    Афіша
                </Link>

                {/* Правий блок */}
                {token ? (
                    <div className={`${styles.rightSection} flex-nowrap`}>
                        <button className={`${styles.authButton} mr-3`} onClick={() => router.push('/user')}>Особистий кабінет</button>
                        <button className={styles.authButton} onClick={Logout}>Вийти</button>
                    </div>
                ) : (
                    <div className={styles.authContainer}>
                        <Link href="/client/login" className={styles.authLink}>
                            Вхід
                        </Link>
                        <Link href="/client/signup" className={styles.authLink}>
                            Реєстрація
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
