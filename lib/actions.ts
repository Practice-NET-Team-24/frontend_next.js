'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {deleteSession} from "@/lib/sessions";
import {redirect} from "next/navigation";

// ...

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);

    } catch (error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }

        }
        throw error;
    }
}

export async function signup(formData: FormData) {
    const payload = {
        username: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const { errors, message } = await response.json();
        return { errors: errors || { general: message } };
    }

    return await response.json();
}

export async function logout() {
    await deleteSession()
    redirect('/client')
}


// export async function SignUp(formData: FormData) {
//     try {
//         await signIn('credentials', formData);
//     } catch (error) {
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return 'Invalid credentials.';
//                 default:
//                     return 'Something went wrong.';
//             }
//         }
//         throw error;
//     }
// }