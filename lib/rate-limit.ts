// Simple in-memory rate limiter.
//
// Suitable for a single-instance (single VPS / single container) deployment:
// state lives in the process and is NOT shared across instances and resets on
// restart. If this app is ever scaled to multiple instances, replace the store
// with Redis/Upstash while keeping the same function signatures.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
let lastSweep = 0;

function sweep(now: number) {
    // Opportunistically evict expired buckets at most once per minute so the
    // Map does not grow without bound.
    if (now - lastSweep < 60_000) return;
    lastSweep = now;
    for (const [key, entry] of store) {
        if (entry.resetAt <= now) store.delete(key);
    }
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Epoch ms when the current window resets. */
    resetAt: number;
}

/**
 * Fixed-window rate limit.
 *
 * @param key      Unique bucket key, e.g. `login:${ip}:${email}`.
 * @param limit    Maximum allowed requests within the window.
 * @param windowMs Window size in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    sweep(now);

    const existing = store.get(key);
    if (!existing || existing.resetAt <= now) {
        const resetAt = now + windowMs;
        store.set(key, { count: 1, resetAt });
        return { success: true, remaining: limit - 1, resetAt };
    }

    existing.count += 1;
    const success = existing.count <= limit;
    return {
        success,
        remaining: Math.max(0, limit - existing.count),
        resetAt: existing.resetAt,
    };
}

/** Best-effort client IP from a request's forwarded headers. */
export function getClientIp(req?: { headers?: Headers } | Request | null): string {
    const headers = (req as Request | undefined)?.headers;
    if (!headers || typeof headers.get !== "function") return "unknown";
    const xff = headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return headers.get("x-real-ip") || "unknown";
}
