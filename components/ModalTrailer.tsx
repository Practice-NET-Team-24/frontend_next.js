import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {CirclePlayIcon} from "lucide-react";
import {ReactNode} from "react";

export default function ModalTrailer({children, title}: {children: ReactNode, title: string | undefined}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className={"max-w-min"}>Watch Trailer <CirclePlayIcon /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px] lg:max-w-[1400px] h-[96vh] w-[96vw]">
                <DialogHeader>
                    <DialogTitle>{title && "Trailer"}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
