import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/sessions'
import {redirect} from "next/navigation";
import {cache} from "react";
import {Role, SessionPayload} from "@/lib/definitions";

export const verifySession = cache(async (): Promise<{ isAuth: boolean; id: number; username: string; role: Role }> => {
    const cookie = (await cookies()).get('session')?.value;

    if (!cookie) {
        return { isAuth: false, id: 0, username: '', role: Role.USER }; // Фіктивне значення
    }

    const session = await decrypt(cookie);

    if (!session || typeof session.id !== 'number' || typeof session.username !== 'string' || !session.role) {
        return { isAuth: false, id: 0, username: '', role: Role.USER }; // Фіктивне значення
    }

    return { isAuth: true, id: session.id, username: session.username, role: session.role };
});