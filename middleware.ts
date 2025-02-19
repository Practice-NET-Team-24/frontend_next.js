import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/sessions'
import { cookies } from 'next/headers'
import {Role} from "@/lib/definitions";



// 1. Specify protected and public routes
const protectedRoutes = ['/admin']
const publicRoutes = ['/client/login', '/client/signup', '/', '/client']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
/*
    console.log('session', session)
    if (isProtectedRoute && (session && session.role !== Role.ADMIN)) {
        return NextResponse.redirect(new URL('/client', req.nextUrl));
    }
    if (isProtectedRoute && (!session || session.role !== Role.ADMIN)) {
        return NextResponse.redirect(new URL('/client/login', req.nextUrl));
    }
*/


    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export const auth = NextAuth(authConfig).auth;

