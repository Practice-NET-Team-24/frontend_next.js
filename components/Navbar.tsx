import React from "react";
import Link from "next/link";
import {verifySession} from "@/lib/dal";
import signOutHandler from "@/lib/signOutHandler";

const Navbar = async () => {
    const session = await verifySession();

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
                {
                    session.isAuth
                    ?<div className={"flex justify-between items-center gap-6"}>
                            <div>PROGRAM</div>
                            {
                                session.role === "Admin"
                                    ? <Link href="/admin">
                                            <button
                                                type={"submit"}
                                                className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium  hover:text-gray-700 md:flex-none md:justify-start md:p-2 md:px-3 dark text-black">
                                                <div className="hidden md:block  w-full">Admin Page</div>
                                            </button>
                                        </Link>
                                    : null
                            }
                            <form
                                action={signOutHandler}
                            >

                                <button
                                    type={"submit"}
                                    className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium  hover:text-gray-700 md:flex-none md:justify-start md:p-2 md:px-3 dark text-black">
                                    <div className=" w-full">Sign Out</div>
                                </button>
                            </form>
                        </div>
                    :<div className={"flex justify-between items-center gap-6"}>
                        <div>PROGRAM</div>
                        <div>
                            <Link href={"/client/login"}>Log In</Link>
                        </div>
                        <div>
                            <Link href={"/client/signup"}>Sign Up</Link>

                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Navbar