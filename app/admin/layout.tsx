import type { Metadata } from "next";
import "../globals.css";
import {checkUserRoleSession} from "@/lib/sessions";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


// Access is restricted by middleware
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await checkUserRoleSession()
  return (
          <div className={"px-14 pt-4"}>

            {children}
          </div>
  );
}
