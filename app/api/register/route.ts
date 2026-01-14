import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validation"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validate input with Zod
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            )
        }

        const { email, password, name } = validationResult.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        })

        return NextResponse.json(
            { message: "User created successfully", user: { id: user.id, email: user.email } },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
