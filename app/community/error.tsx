'use client'

import ErrorBoundaryFallback from '@/app/components/ErrorBoundaryFallback'

export default function CommunityError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <ErrorBoundaryFallback error={error} reset={reset} />
}
