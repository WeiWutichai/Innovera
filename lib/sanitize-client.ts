import DOMPurify from "dompurify";

/**
 * Client-only sanitizer for user-authored rich text. Keep this separate from
 * lib/sanitize.ts because that module uses isomorphic-dompurify/jsdom and can
 * break client route SSR in development/standalone bundles.
 */
export function sanitizeClientHtml(dirty: string | null | undefined): string {
    if (!dirty || typeof window === "undefined") return "";

    return DOMPurify.sanitize(dirty, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
    });
}
