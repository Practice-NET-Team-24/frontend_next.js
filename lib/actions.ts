'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {createSession, deleteSession} from "@/lib/sessions";
import {redirect} from "next/navigation";
import {SessionPayload} from "@/lib/definitions";

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

export async function signup(prevState: string | undefined, formData: FormData) {
    const payload = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const response = await fetch(process.env.BASE_URL + "/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const { errors, message } = await response.json();
        return { errors: errors || { general: message } };
    }

    const data = await response.json()
    const sessionPayload: SessionPayload = {
        id: data.id,
        username: data.username,
        role: data.role,
    }

    await createSession(sessionPayload);
    redirect("/client")

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