import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;