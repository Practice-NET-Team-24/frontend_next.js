
import type { Metadata } from "next";
import "../globals.css";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AdminNav from "@/components/ui/admin-nav";


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

  return (
          <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                  <AdminNav/>
                  <div className={"px-2"}>
                      {children}
                  </div>

              </SidebarInset>
          </SidebarProvider>

  );
}
