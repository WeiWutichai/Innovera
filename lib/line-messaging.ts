import crypto from 'crypto';

// LINE Messaging API Configuration
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';

// LINE API Endpoints
const LINE_API_BASE = 'https://api.line.me/v2';
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';

/**
 * Verify LINE webhook signature
 */
export function verifyLineSignature(body: string, signature: string): boolean {
    if (!LINE_CHANNEL_SECRET) {
        console.warn('LINE_CHANNEL_SECRET not configured');
        return false;
    }

    const hash = crypto
        .createHmac('SHA256', LINE_CHANNEL_SECRET)
        .update(body)
        .digest('base64');

    return hash === signature;
}

/**
 * Get LINE user profile by userId
 */
export async function getLineUserProfile(userId: string): Promise<{
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
} | null> {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN not configured');
        return null;
    }

    try {
        const response = await fetch(`${LINE_MESSAGING_API}/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to get LINE profile:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching LINE profile:', error);
        return null;
    }
}

/**
 * Send push message to a LINE user
 */
export async function sendLinePushMessage(
    userId: string,
    messages: LineMessage[]
): Promise<boolean> {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN not configured');
        return false;
    }

    try {
        const response = await fetch(`${LINE_MESSAGING_API}/message/push`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: userId,
                messages: messages.slice(0, 5), // LINE allows max 5 messages
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Failed to send LINE message:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending LINE message:', error);
        return false;
    }
}

/**
 * Send multicast message to multiple LINE users
 */
export async function sendLineMulticastMessage(
    userIds: string[],
    messages: LineMessage[]
): Promise<boolean> {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN not configured');
        return false;
    }

    if (userIds.length === 0) {
        return true;
    }

    // LINE allows max 500 users per multicast
    const chunks = [];
    for (let i = 0; i < userIds.length; i += 500) {
        chunks.push(userIds.slice(i, i + 500));
    }

    try {
        for (const chunk of chunks) {
            const response = await fetch(`${LINE_MESSAGING_API}/message/multicast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    to: chunk,
                    messages: messages.slice(0, 5),
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Failed to send LINE multicast:', error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error sending LINE multicast:', error);
        return false;
    }
}

// LINE Message Types
export interface LineTextMessage {
    type: 'text';
    text: string;
}

export interface LineFlexMessage {
    type: 'flex';
    altText: string;
    contents: object;
}

export type LineMessage = LineTextMessage | LineFlexMessage;

/**
 * Create a simple text message
 */
export function createTextMessage(text: string): LineTextMessage {
    return {
        type: 'text',
        text,
    };
}

/**
 * Create an issue notification message
 */
export function createIssueNotification(
    eventType: 'create' | 'accept' | 'complete' | 'reject' | 'close' | 'comment',
    issue: {
        id: string;
        title: string;
        productName?: string;
        actorName?: string;
    },
    baseUrl: string
): LineTextMessage {
    const eventLabels: Record<string, { emoji: string; label: string }> = {
        create: { emoji: '🆕', label: 'Issue ใหม่' },
        accept: { emoji: '✋', label: 'Issue ถูก Accept' },
        complete: { emoji: '✅', label: 'แก้ไขเสร็จแล้ว' },
        reject: { emoji: '❌', label: 'Issue ถูก Reject' },
        close: { emoji: '🔒', label: 'Issue ถูกปิด' },
        comment: { emoji: '💬', label: 'Comment ใหม่' },
    };

    const { emoji, label } = eventLabels[eventType] || { emoji: '📢', label: 'อัปเดต Issue' };

    let text = `${emoji} ${label}\n`;
    text += `📝 ${issue.title}\n`;

    if (issue.productName) {
        text += `📦 ${issue.productName}\n`;
    }

    if (issue.actorName) {
        text += `👤 โดย: ${issue.actorName}\n`;
    }

    text += `\n🔗 ${baseUrl}/community/issues/view/${issue.id}`;

    return createTextMessage(text);
}
