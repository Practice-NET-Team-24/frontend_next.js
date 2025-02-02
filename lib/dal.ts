import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/sessions'
import {redirect} from "next/navigation";
import {cache} from "react";

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.id) {
        redirect('/login')
    }

    return { isAuth: true, id: session.id, username: session.username, role: session.role  }
})