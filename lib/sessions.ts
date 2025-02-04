import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import {Role, SessionPayload} from '@/lib/definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });

        const { id, username, role } = payload;

        if (
            typeof id === 'number' &&
            typeof username === 'string' &&
            typeof role === 'string'
        ) {
            return { id, username, role: role as Role };
        }

        return null;
    } catch (error) {
        console.log('Failed to verify session:', error);
        return null;
    }
}

import 'server-only'
import { cookies } from 'next/headers'

export async function createSession({id, username, role = Role.USER}: {id: number, username: string, role: Role}) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ id, username, role })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function checkUserRoleSession() {
    const session = (await cookies()).get('session')?.value
    if (!session) {
        return Role.USER; // Default to USER role if no session
    }
    const payload = await decrypt(session)

    if (!session || !payload) {
        return Role.USER
    }
    if(payload.role == Role.ADMIN) {
        return Role.ADMIN
    }
    return Role.USER;

}