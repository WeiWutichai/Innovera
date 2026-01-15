import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateChatResponse } from "@/lib/gemini";
import { sanitizeMessage } from "@/lib/chatUtils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, message, userId, guestId, requestHumanSupport } = body;

        // Validate input
        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Message is required" },
                { status: 400 }
            );
        }

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: "Session ID is required" },
                { status: 400 }
            );
        }

        // Sanitize message
        const sanitizedMessage = sanitizeMessage(message);

        if (sanitizedMessage.length > 1000) {
            return NextResponse.json(
                { success: false, error: "Message too long (max 1000 characters)" },
                { status: 400 }
            );
        }

        // Get or create session
        let session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { timestamp: "asc" },
                    take: 10, // Last 10 messages for context
                },
            },
        });

        if (!session) {
            // Create new session
            session = await prisma.chatSession.create({
                data: {
                    id: sessionId,
                    userId: userId ? parseInt(userId) : null,
                    guestId: guestId || null,
                    lastMessageAt: new Date(),
                },
                include: { messages: true },
            });
        }

        // Update session if human support is requested
        if (requestHumanSupport) {
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: {
                    requestHumanSupport: true,
                    lastMessageAt: new Date(),
                },
            });
        } else {
            // Update lastMessageAt
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: {
                    lastMessageAt: new Date(),
                },
            });
        }

        // Save user message (mark as unread by admin)
        const userMessage = await prisma.message.create({
            data: {
                sessionId: session.id,
                role: "user",
                content: sanitizedMessage,
                isReadByAdmin: false,
                sentByAdmin: false,
            },
        });

        // Build conversation history
        const history = session.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }));

        // Generate AI response (only if not requesting human support)
        let assistantMessage = null;
        if (!requestHumanSupport) {
            const aiResponse = await generateChatResponse(sanitizedMessage, history);

            // Save AI response
            assistantMessage = await prisma.message.create({
                data: {
                    sessionId: session.id,
                    role: "assistant",
                    content: aiResponse,
                    isReadByAdmin: true,
                    sentByAdmin: false,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                userMessage: {
                    id: userMessage.id,
                    content: userMessage.content,
                    timestamp: userMessage.timestamp,
                },
                assistantMessage: assistantMessage ? {
                    id: assistantMessage.id,
                    content: assistantMessage.content,
                    timestamp: assistantMessage.timestamp,
                } : null,
                sessionId: session.id,
                humanSupportRequested: requestHumanSupport || false,
            },
        });
    } catch (error) {
        console.error("Chat send error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process message" },
            { status: 500 }
        );
    }
}
