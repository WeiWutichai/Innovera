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

    try {
        const hashBuffer = Buffer.from(hash);
        const signatureBuffer = Buffer.from(signature);

        // timingSafeEqual throws if buffers differ in length
        if (hashBuffer.length !== signatureBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(hashBuffer, signatureBuffer);
    } catch {
        return false;
    }
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
            signal: AbortSignal.timeout(10000),
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
            signal: AbortSignal.timeout(10000),
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
                signal: AbortSignal.timeout(10000),
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
): LineFlexMessage {
    const eventLabels: Record<string, { emoji: string; label: string; color: string; icon: string }> = {
        create: { emoji: '🆕', label: 'Issue ใหม่', color: '#00A950', icon: 'https://cdn-icons-png.flaticon.com/512/5905/5905335.png' },
        accept: { emoji: '✋', label: 'Issue ถูก Accept', color: '#00A950', icon: 'https://cdn-icons-png.flaticon.com/512/1045/1045381.png' },
        complete: { emoji: '✅', label: 'แก้ไขเสร็จแล้ว', color: '#00A950', icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' },
        reject: { emoji: '❌', label: 'Issue ถูก Reject', color: '#E53E3E', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' },
        close: { emoji: '🔒', label: 'Issue ถูกปิด', color: '#718096', icon: 'https://cdn-icons-png.flaticon.com/512/121/121941.png' },
        comment: { emoji: '💬', label: 'Comment ใหม่', color: '#3182CE', icon: 'https://cdn-icons-png.flaticon.com/512/1380/1380338.png' },
    };

    const config = eventLabels[eventType] || { emoji: '📢', label: 'อัปเดต Issue', color: '#00A950', icon: 'https://cdn-icons-png.flaticon.com/512/5905/5905335.png' };

    // Format timestamp in Thai style: 27 ม.ค. 69 22:31 น.
    const now = new Date();
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = now.getDate();
    const month = thaiMonths[now.getMonth()];
    const year = (now.getFullYear() + 543).toString().slice(-2);
    const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    const timestamp = `${day} ${month} ${year} ${time} น.`;

    const contents = {
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "image",
                                    "url": config.icon,
                                    "size": "xxs",
                                    "aspectMode": "fit"
                                }
                            ],
                            "width": "48px",
                            "height": "48px",
                            "backgroundColor": config.color,
                            "cornerRadius": "100px",
                            "justifyContent": "center",
                            "alignItems": "center"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": config.label,
                                    "weight": "bold",
                                    "size": "xl",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": timestamp,
                                    "size": "sm",
                                    "color": "#8C8C8C",
                                    "contents": []
                                }
                            ],
                            "margin": "lg",
                            "spacing": "none"
                        }
                    ],
                    "alignItems": "center"
                },
                {
                    "type": "separator",
                    "margin": "xl"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "เรื่อง",
                                    "size": "sm",
                                    "color": "#8C8C8C",
                                    "flex": 2
                                },
                                {
                                    "type": "text",
                                    "text": issue.title,
                                    "size": "sm",
                                    "color": "#111111",
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 4,
                                    "wrap": true
                                }
                            ]
                        }
                    ],
                    "margin": "xl",
                    "spacing": "md"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "โปรดักส์",
                                    "size": "sm",
                                    "color": "#8C8C8C",
                                    "flex": 2
                                },
                                {
                                    "type": "text",
                                    "text": issue.productName || "-",
                                    "size": "sm",
                                    "color": "#111111",
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 4,
                                    "wrap": true
                                }
                            ]
                        }
                    ],
                    "margin": "md",
                    "spacing": "md"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "โดย",
                                    "size": "sm",
                                    "color": "#8C8C8C",
                                    "flex": 2
                                },
                                {
                                    "type": "text",
                                    "text": issue.actorName || "-",
                                    "size": "sm",
                                    "color": "#111111",
                                    "align": "end",
                                    "weight": "bold",
                                    "flex": 4,
                                    "wrap": true
                                }
                            ]
                        }
                    ],
                    "margin": "md",
                    "spacing": "md"
                },
                {
                    "type": "separator",
                    "margin": "xl"
                },
                {
                    "type": "button",
                    "action": {
                        "type": "uri",
                        "label": "ดูรายละเอียด",
                        "uri": `${baseUrl}/community/issues/view/${issue.id}`
                    },
                    "style": "primary",
                    "color": config.color,
                    "margin": "xl",
                    "height": "sm"
                }
            ],
            "paddingAll": "20px"
        },
        "styles": {
            "footer": {
                "separator": true
            }
        }
    };

    return {
        type: 'flex',
        altText: `${config.emoji} ${config.label}: ${issue.title}`,
        contents
    };
}
