import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import {User} from '@/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import {createSession} from "@/lib/sessions";
import {db} from "@/database";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string) {
    try {
        return await db
            .selectFrom('users')
            .select(['id', 'username', 'email', 'role', 'password_hash'])
            .where('users.email', '=', email)
            .executeTakeFirstOrThrow();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials, request): Promise<User | null> {
                // const parsedCredentials = z
                //     .object({ email: z.string().email(), password: z.string().min(6) })
                //     .safeParse(credentials);
                //
                // if (parsedCredentials.success) {
                //     const { email, password } = parsedCredentials.data;
                //     const user = await getUser(email);
                //     if (!user) return null;
                //     const passwordsMatch = await bcrypt.compare(password, user.password_hash);
                //
                //
                //     if (passwordsMatch) {
                //         await createSession({id: Number(user.id), username: user.username, role: user.role})
                //         return { id: user.id, name: user.username, role: user.role };
                //     }
                // }
                //
                // console.log('Invalid credentials');
                // return null;
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.error('Invalid credentials format');
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);

                if (!user) {
                    console.error('User not found');
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(password, user.password_hash);
                if (!passwordsMatch) {
                    console.error('Password mismatch');
                    return null;
                }

                await createSession({
                    id: Number(user.id),
                    username: user.username,
                    role: user.role,
                });

                return { id: user.id, username: user.username, role: user.role, password: user.password_hash, email: user.email };
            },
        }),
    ],
});