'use server'
import {signOut} from "@/auth";

export default async function signOutHandler() {
        return await signOut({ redirectTo: '/' });
}