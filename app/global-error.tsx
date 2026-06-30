'use client'

// Root-level error boundary. This replaces the root layout when an error is
// thrown above it, so it must render its own <html> and <body>. Styles are
// inline because the global stylesheet is not guaranteed to be loaded here.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    color: '#fafafa',
                    fontFamily:
                        'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    padding: '1rem',
                }}
            >
                <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#a3a3a3', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
