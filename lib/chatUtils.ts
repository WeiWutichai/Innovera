export function generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 minute
    if (diff < 60000) {
        return "Just now";
    }

    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }

    // Format as time
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function sanitizeMessage(message: string): string {
    // Remove HTML tags
    return message.replace(/<[^>]*>/g, "").trim();
}

export function truncateMessage(message: string, maxLength: number = 100): string {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
}

export function detectLanguage(text: string): "th" | "en" {
    // Simple Thai character detection
    const thaiPattern = /[\u0E00-\u0E7F]/;
    return thaiPattern.test(text) ? "th" : "en";
}
