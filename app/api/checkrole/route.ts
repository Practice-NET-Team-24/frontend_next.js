import { NextResponse } from "next/server";
import { db } from "@/database";
import {verifySession} from "@/lib/dal";

export async function GET(req: Request, res: Response) {
    try {
        const {username} = await verifySession();

        const user = await db
            .selectFrom("users")
            .select(['username', 'role', 'email'])
            .where("username", "=", username)
            .executeTakeFirstOrThrow();


        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred during account creation." },
            { status: 500 }
        );
    }
}
