'use client'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { Button } from '@/components/ui/button';
import { FormEvent, useActionState, useState } from 'react';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export interface LoginResponse {
  $id: string
  token: string
  expiration: string
}

export default function LoginForm({
}: React.ComponentPropsWithoutRef<"div">) {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/client';
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/Account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!res.ok) {
        console.error('Login failed');
        return;
    }

    var data = await res.json();
    console.log(data)
    const token = data.token;

    if (typeof window !== 'undefined' && token) {
        localStorage.setItem('token', token);
        router.push('/client/program');
    }

    setIsPending(false);
}


  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 ">
            <div className="grid gap-2 ">
              <Label htmlFor="email">Email</Label>
              <input
                className="text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <input className=" text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <button className="mt-4 w-full" aria-disabled={isPending} onClick={handleSubmit}>
              Log in
            </button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/client/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
