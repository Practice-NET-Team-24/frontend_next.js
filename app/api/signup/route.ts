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

        const existingUser = await db
            .selectFrom("users")
            .where((eb) => eb.or([
                eb("username", "=", username),
                eb("email", "=", email)
            ]))
            .selectAll()
            .executeTakeFirst();

        if (existingUser) {
            return NextResponse.json(
                { errors: { general: "Username or email already taken." } },
                { status: 400 }
            );
        }

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

        return NextResponse.json(insertedUser)
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: JSON.stringify(error) },
            { status: 500 }
        );
    }
}
