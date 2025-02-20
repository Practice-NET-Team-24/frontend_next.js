'use client';
import { signup } from '@/lib/actions';
import { useActionState, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export interface RegisterForm {
    name: string
    email: string
    password: string
}


export default function SignupForm() {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/client';
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const [userForm, setUserForm] = useState<RegisterForm>({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (property: keyof RegisterForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (userForm)
            setUserForm({ ...userForm, [property]: event.target.value });
    };

    const handleFormSubmission = async () => {
        setPending(true);
        if (!userForm) return;
        try {
            const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/Account/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userForm),
            });

            if (response.ok) {
                router.push(callbackUrl);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };


    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>Fill in your details to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <input
                                className="text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                required
                                value={userForm?.name}
                                onChange={handleInputChange('name')}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <input
                                className=" text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                value={userForm?.email}
                                onChange={handleInputChange('email')}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <input
                                className="text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={8}
                                value={userForm?.password}
                                onChange={handleInputChange('password')}
                            />
                        </div>

                        <button className="mt-4 w-full" aria-disabled={pending} onClick={handleFormSubmission}>
                            <input type="hidden" name="redirectTo" value={callbackUrl} />
                            {pending ? "Processing..." : "Sign Up"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
