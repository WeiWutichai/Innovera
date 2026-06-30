import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyLineSignature, getLineUserProfile } from '@/lib/line-messaging';

// LINE Webhook Event Types
interface LineEvent {
    type: string;
    timestamp: number;
    source: {
        type: string;
        userId?: string;
    };
    replyToken?: string;
}

interface LineWebhookBody {
    destination: string;
    events: LineEvent[];
}

// GET - for LINE webhook verification
export async function GET() {
    return NextResponse.json({ status: 'ok' });
}

// POST - receive LINE webhook events
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-line-signature') || '';

        // Verify signature by default in ALL environments.
        // Only skip when explicitly opted out for local dev.
        const isValid = verifyLineSignature(body, signature);
        if (!isValid && process.env.ALLOW_UNSIGNED_LINE_WEBHOOK !== 'true') {
            console.warn('Invalid LINE webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const webhookBody: LineWebhookBody = JSON.parse(body);

        // Guard against malformed payloads
        if (!Array.isArray(webhookBody.events)) {
            return NextResponse.json({ status: 'ok' });
        }

        // Replay guard: ignore events older than ~5 minutes (timestamps are epoch ms)
        const MAX_EVENT_AGE_MS = 5 * 60 * 1000;
        const now = Date.now();

        // Process events
        for (const event of webhookBody.events) {
            if (
                typeof event.timestamp === 'number' &&
                now - event.timestamp > MAX_EVENT_AGE_MS
            ) {
                console.warn('Skipping stale LINE event:', event.type, event.timestamp);
                continue;
            }
            await handleLineEvent(event);
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('LINE webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handleLineEvent(event: LineEvent) {
    const userId = event.source.userId;

    if (!userId) {
        console.log('No userId in event');
        return;
    }

    switch (event.type) {
        case 'follow':
            // User added the LINE OA as friend
            await handleFollow(userId);
            break;

        case 'unfollow':
            // User blocked or removed the LINE OA
            await handleUnfollow(userId);
            break;

        default:
            console.log('Unhandled event type:', event.type);
    }
}

async function handleFollow(lineUserId: string) {
    console.log('New follower:', lineUserId);

    try {
        // Check if user already exists
        const existing = await prisma.lineUser.findUnique({
            where: { lineUserId },
        });

        if (existing) {
            console.log('User already exists:', lineUserId);
            return;
        }

        // Get user profile from LINE
        const profile = await getLineUserProfile(lineUserId);

        // Create new LINE user record
        await prisma.lineUser.create({
            data: {
                lineUserId,
                displayName: profile?.displayName || null,
                pictureUrl: profile?.pictureUrl || null,
            },
        });

        console.log('Created LINE user:', lineUserId, profile?.displayName);
    } catch (error) {
        console.error('Error handling follow:', error);
    }
}

async function handleUnfollow(lineUserId: string) {
    console.log('User unfollowed:', lineUserId);

    try {
        // Optional: Delete or mark as inactive
        // For now, we'll keep the record but you can delete if preferred
        await prisma.lineUser.delete({
            where: { lineUserId },
        }).catch(() => {
            // Ignore if not found
        });

        console.log('Removed LINE user:', lineUserId);
    } catch (error) {
        console.error('Error handling unfollow:', error);
    }
}
