'use client'

import ErrorBoundaryFallback from '@/app/components/ErrorBoundaryFallback'

export default function BlogError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <ErrorBoundaryFallback error={error} reset={reset} />
}
