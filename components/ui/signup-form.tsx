'use client';
import { signup } from '@/lib/actions';
import { useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined);

    return (
        <form action={action} className={cn("flex flex-col gap-6")}>
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
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Username"
                                required
                            />
                            {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}
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
                            />
                            {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}
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
                                minLength={6}
                            />
                            {state?.errors?.password && <p className="text-red-500">{state.errors.password}</p>}
                        </div>
                        <Button type="submit" className="mt-4 w-full" aria-disabled={pending}>
                            {pending ? "Processing..." : "Sign Up"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
