"use client"

import * as React from "react"
import {
  BookOpen,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {verifySession} from "@/lib/dal";
import {useEffect} from "react";
import {Role} from "@/lib/definitions";

// This is sample data.
const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  navMain: [
    {
      title: "Films",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Create",
          url: "#",
        },
      ],
    },
    {
      title: "Halls",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Manage",
          url: "#",
        },
        {
          title: "Add",
          url: "#",
        },
      ]
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{username: string, email: string, role: Role} | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/checkrole");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchUser();
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={{avatar: "", name: user?.username || "", email: user?.email || ""}} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
