import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return new NextResponse(
                JSON.stringify({ error: "Email already exists" }),
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Registration error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Something went wrong" }),
            { status: 500 }
        );
    }
}
