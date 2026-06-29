import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validation"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { BCRYPT_ROUNDS } from "@/lib/constants"

// Neutral response used for both "created" and "already exists" so the endpoint
// does not become an account-enumeration oracle.
const NEUTRAL_MESSAGE =
    "Registration received. If the email is not already in use, the account has been created and is pending approval."

export async function POST(req: Request) {
    try {
        // Rate limit account creation per IP.
        const ip = getClientIp(req)
        const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)
        if (!rl.success) {
            return NextResponse.json(
                { error: "Too many registration attempts. Please try again later." },
                { status: 429 }
            )
        }

        const body = await req.json()

        // Validate input with Zod
        const validationResult = registerSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.format() },
                { status: 400 }
            )
        }

        const { email, password, name } = validationResult.data

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        })

        if (!existingUser) {
            const hashedPassword = await hash(password, BCRYPT_ROUNDS)
            await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    isApproved: false,
                },
            })
        }

        // Same response whether or not the user already existed.
        return NextResponse.json({ message: NEUTRAL_MESSAGE }, { status: 201 })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
