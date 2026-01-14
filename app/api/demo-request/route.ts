import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { demoRequestSchema } from "@/lib/validation";
import { z } from "zod";

// POST: Create a new demo request (Public)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input with Zod
        const validationResult = demoRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                error: "Validation failed",
                details: validationResult.error.format()
            }, { status: 400 });
        }

        const { workEmail, firstName, lastName, phoneNumber, companyName, country, interest } = validationResult.data;

        const demoRequest = await prisma.demoRequest.create({
            data: {
                workEmail,
                firstName,
                lastName,
                phoneNumber: phoneNumber || "",
                companyName,
                country: country || "Not Specified",
                interest: interest || "General Inquiry",
            },
        });

        return NextResponse.json(demoRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating demo request:", error);
        const errorMessage = process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Failed to create demo request";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}

// GET: List all demo requests (Admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requests = await prisma.demoRequest.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching demo requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
