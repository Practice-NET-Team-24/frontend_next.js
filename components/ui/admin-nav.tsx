"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Undo2Icon} from "lucide-react";
import {useRouter} from "next/navigation";

export default function AdminNav() {
    const router = useRouter();

    return (
        <header className="flex  items-center px-6 py-2 justify-between">
            <SidebarTrigger className="-ml-1" />
            <Button
                onClick={() => {router.back()}}
                className={"flex items-center"}
            >
                Back <Undo2Icon />
            </Button>
        </header>
    )
}