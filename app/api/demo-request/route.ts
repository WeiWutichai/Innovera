import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

// POST: Create a new demo request (Public)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { workEmail, firstName, lastName, phoneNumber, companyName, country, interest } = body;

        // Basic validation
        if (!workEmail || !firstName || !lastName || !companyName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

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
        return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
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
