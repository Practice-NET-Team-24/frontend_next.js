import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/database";
import {Role, SignupFormSchema} from "@/lib/definitions";
import {createSession} from "@/lib/sessions";
import {redirect} from "next/navigation";

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const result = SignupFormSchema.safeParse(formData);

        if (!result.success) {
            return NextResponse.json(
                { errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { username, email, password } = result.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password_hash: hashedPassword,
            role: Role.USER
        };

        const insertedUser = await db
            .insertInto("users")
            .values(newUser)
            .returning(['id', 'username', 'role'])
            .executeTakeFirstOrThrow();

        await createSession(insertedUser)
        redirect('/client')
        return NextResponse.json(insertedUser);
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred during account creation." },
            { status: 500 }
        );
    }
}
