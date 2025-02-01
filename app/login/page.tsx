
import { Suspense } from 'react';
import LoginForm from "@/components/login-form";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}