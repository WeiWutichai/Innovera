import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateChatResponse } from "@/lib/gemini";
import { sanitizeMessage } from "@/lib/chatUtils";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { chatMessageSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);

        // Validate input shape (sessionId, message<=1000, optional guestId, etc.).
        const parsed = chatMessageSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: parsed.error.issues[0]?.message || "Invalid request",
                },
                { status: 400 }
            );
        }

        const { sessionId, message, requestHumanSupport } = parsed.data;
        const guestId = parsed.data.guestId ?? null;

        // Identity is derived from the session, NEVER trusted from the body.
        // Logged-in users are authoritative via their session user id; guests are
        // identified by the guestId they supply.
        const authSession = await auth();
        const authUserId = authSession?.user?.id ? Number(authSession.user.id) : null;

        // Rate limit to prevent Gemini cost-abuse / DoS. Per-IP and per-session.
        const ip = getClientIp(request);
        if (!rateLimit(`chat:${ip}`, 20, 60_000).success) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }
        if (!rateLimit(`chat-msg:${sessionId}`, 30, 60_000).success) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }

        // Sanitize message
        const sanitizedMessage = sanitizeMessage(message);

        if (sanitizedMessage.length === 0) {
            return NextResponse.json(
                { success: false, error: "Message is required" },
                { status: 400 }
            );
        }

        if (sanitizedMessage.length > 1000) {
            return NextResponse.json(
                { success: false, error: "Message too long (max 1000 characters)" },
                { status: 400 }
            );
        }

        // Get-or-create session. Load the NEWEST 10 messages for AI context.
        let session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { timestamp: "desc" },
                    take: 10, // Newest 10 messages for context (reversed below)
                },
            },
        });

        if (!session) {
            // Create a new session bound to the caller's identity. Use upsert so
            // two concurrent first-messages cannot race into a unique-id error;
            // a concurrent create is returned by the update branch and re-checked
            // for ownership below.
            session = await prisma.chatSession.upsert({
                where: { id: sessionId },
                update: {},
                create: {
                    id: sessionId,
                    userId: authUserId,
                    guestId: authUserId ? null : guestId,
                    lastMessageAt: new Date(),
                },
                include: {
                    messages: {
                        orderBy: { timestamp: "desc" },
                        take: 10,
                    },
                },
            });
        }

        // Anti-hijack: the caller must own the session before appending to it.
        // Owned by a logged-in user -> require matching authenticated id.
        // Owned by a guest -> require matching guestId from the body.
        const ownsSession =
            session.userId !== null
                ? authUserId !== null && authUserId === session.userId
                : session.guestId
                    ? !!guestId && guestId === session.guestId
                    : false;

        if (!ownsSession) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
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

        // Build conversation history in chronological order (oldest -> newest).
        // The query above fetched newest-first, so reverse before sending to the
        // model.
        const history = [...session.messages].reverse().map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }));

        // Check if bot should respond (Smart Handoff Logic)
        const shouldBotRespond = () => {
            // Always respond if requesting human support
            if (requestHumanSupport) return false;

            // If admin never took over, bot always responds
            if (!session.adminTookOver) return true;

            // Check if the user explicitly mentions the bot to resume AI replies.
            // Use exact-word / explicit-mention matching to avoid false positives
            // from broad substrings (e.g. "ai" inside "wait", "inno" inside
            // "innovation").
            const lower = sanitizedMessage.toLowerCase();
            // English word tokens (Thai is matched as substrings below since it is
            // written without spaces).
            const words = new Set(lower.split(/[^a-z0-9]+/).filter(Boolean));
            const mentionsBot =
                sanitizedMessage.includes("น้องอินโน") ||
                sanitizedMessage.includes("อินโน") ||
                lower.includes("@inno") ||
                words.has("bot");
            if (mentionsBot) {
                console.log('User mentioned bot - resuming AI responses');
                return true;
            }

            // Check 5-minute timeout
            if (session.lastAdminReplyAt) {
                const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
                const timeSinceAdminReply = Date.now() - new Date(session.lastAdminReplyAt).getTime();
                if (timeSinceAdminReply > TIMEOUT_MS) {
                    console.log('Admin timeout (5 min) - resuming AI responses');
                    return true;
                }
            }

            // Admin is handling - bot should not respond
            console.log('Admin is handling conversation - bot silent');
            return false;
        };

        // Generate AI response (only if bot should respond)
        let assistantMessage = null;
        const botShouldRespond = shouldBotRespond();

        if (botShouldRespond) {
            // Reset adminTookOver if bot is resuming
            if (session.adminTookOver) {
                await prisma.chatSession.update({
                    where: { id: sessionId },
                    data: { adminTookOver: false },
                });
            }

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
