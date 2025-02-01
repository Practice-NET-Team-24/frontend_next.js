import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <div className={"px-14 py-4 navbar-shadow"}>
            <div className={"flex justify-between items-center"}>
                <div className="logo">
                    <img
                        width={80}
                        src="https://t3.ftcdn.net/jpg/03/24/30/24/360_F_324302474_PPtpdsBgyhJjxCaWXDwrOzdlYRlPmIh2.jpg"
                        alt="logo"
                    />
                </div>
                <div className={"flex justify-between items-center gap-6"}>
                    <div>PROGRAM</div>
                    <div>
                        <Link href={"/login"}>Log In</Link>
                    </div>
                    <div>
                        Sign Up
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar