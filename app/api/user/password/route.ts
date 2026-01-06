
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { compare, hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { oldPassword, newPassword } = await req.json()

        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // 1. Fetch user to get current password hash
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found or using OAuth" }, { status: 404 })
        }

        // 2. Verify Old Password
        const isValid = await compare(oldPassword, user.password)

        if (!isValid) {
            return NextResponse.json({ error: "Incorrect old password" }, { status: 400 })
        }

        // 3. Hash New Password
        const hashedPassword = await hash(newPassword, 10)

        // 4. Update in DB
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        })

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("Password change error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
