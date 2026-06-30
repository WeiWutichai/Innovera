
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcryptjs"
import { passwordSchema } from "@/lib/validation"
import { BCRYPT_ROUNDS } from "@/lib/constants"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { name, oldPassword, newPassword } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const updateData: any = {}

        // Update Name if provided
        if (name && name !== user.name) {
            updateData.name = name
        }

        // Update Password if provided
        if (newPassword) {
            if (!user.password) {
                return NextResponse.json({ error: "User uses OAuth, cannot change password" }, { status: 400 })
            }
            if (!oldPassword) {
                return NextResponse.json({ error: "Current password required" }, { status: 400 })
            }

            // Enforce the shared password policy (min 8 chars) before hashing.
            const parsedPassword = passwordSchema.safeParse(newPassword)
            if (!parsedPassword.success) {
                return NextResponse.json(
                    { error: parsedPassword.error.issues[0].message },
                    { status: 400 }
                )
            }

            const isValid = await compare(oldPassword, user.password)
            if (!isValid) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 })
            }

            updateData.password = await hash(newPassword, BCRYPT_ROUNDS)
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "No changes made" })
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        })

        return NextResponse.json({ message: "Profile updated successfully" })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
