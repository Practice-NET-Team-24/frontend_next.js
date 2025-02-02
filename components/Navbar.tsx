import React from "react";
import Link from "next/link";

const Navbar = () => {


    return (
        <div className={"px-14 py-4 navbar-shadow"}>
            <div className={"flex justify-between items-center"}>
                <div className="logo">
                    <Link href="/">
                        <img
                            width={80}
                            src="https://t3.ftcdn.net/jpg/03/24/30/24/360_F_324302474_PPtpdsBgyhJjxCaWXDwrOzdlYRlPmIh2.jpg"
                            alt="logo"
                        />
                    </Link>

                </div>
                <div className={"flex justify-between items-center gap-6"}>
                    <div>PROGRAM</div>
                    <div>
                        <Link href={"/client/login"}>Log In</Link>
                    </div>
                    <div>
                        <Link href={"/client/signup"}>Sign Up</Link>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar