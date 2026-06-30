// Pure URL helpers. Intentionally free of any DOM/sanitizer dependency so they
// are safe to import from Server Components (no jsdom/DOMPurify in the server
// bundle). HTML sanitization lives in lib/sanitize.ts (client components only).

/**
 * Extract an 11-char YouTube video id from common URL formats.
 * Returns null for anything that is not a recognized YouTube URL.
 */
export function youtubeVideoId(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
        const isId = (id: string) => (/^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null);

        if (host === "youtu.be") {
            return isId(u.pathname.slice(1));
        }
        if (host === "youtube.com") {
            if (u.pathname === "/watch") return isId(u.searchParams.get("v") || "");
            const embed = u.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})$/);
            if (embed) return embed[1];
        }
        return null;
    } catch {
        return null;
    }
}

/** Safe YouTube embed URL, or null if the input is not a valid YouTube link. */
export function youtubeEmbedUrl(url: string | null | undefined): string | null {
    const id = youtubeVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
}
