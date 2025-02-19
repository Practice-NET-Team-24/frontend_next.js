import React from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import signOutHandler from "@/lib/signOutHandler";
import styles from "@/styles/Navbar.module.css";

const Navbar = async () => {
    const session = await verifySession();

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
                {session.isAuth ? (
                    <div className={styles.rightSection}>
                        {session.role === "Admin" && (
                            <Link href="/admin">
                                <button className={styles.adminButton}>
                                    Admin Page
                                </button>
                            </Link>
                        )}
                        <form action={signOutHandler}>
                            <button className={styles.authButton}>Вийти</button>
                        </form>
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
