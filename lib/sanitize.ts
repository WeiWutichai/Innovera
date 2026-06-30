import DOMPurify from "isomorphic-dompurify";

// NOTE: this module pulls in DOMPurify (and, on the server, jsdom). Import it
// ONLY from Client Components. Server Components that just need the YouTube URL
// helpers should import them from lib/url-utils.ts instead.

/**
 * Sanitize untrusted HTML before rendering via dangerouslySetInnerHTML.
 * Allows rich-text formatting but strips scripts, event handlers, inline
 * styles, and embedding tags that enable XSS.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return "";
    return DOMPurify.sanitize(dirty, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
    });
}

// Re-export the pure URL helpers so existing client-component imports of
// `youtubeEmbedUrl` from this module keep working.
export { youtubeVideoId, youtubeEmbedUrl } from "./url-utils";
