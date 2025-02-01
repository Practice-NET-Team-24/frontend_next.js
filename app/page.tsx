import React from 'react';
import Link from "next/link";
import Navbar from "@/components/Navbar";

const Home = () => {
    return (
        <>
            <Navbar/>
            <div className={"px-14 py-4"}>
                <Link href="/admin">Admin</Link>
            </div>

        </>

    );
};

export default Home;