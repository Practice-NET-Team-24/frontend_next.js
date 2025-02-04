'use server'
import {signOut} from "@/auth";
import {deleteSession} from "@/lib/sessions";

export default async function signOutHandler() {
        await deleteSession();
        return await signOut({ redirectTo: '/client' });
}