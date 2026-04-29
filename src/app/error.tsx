'use client'
import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        
        console.error(error.message, { digest: error.digest })
    }, [error])

    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="font-display text-[120px] font-bold leading-none text-[var(--color-border)] select-none">
                    500
                </div>
                <div className="space-y-2">
                    <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
                    <p className="text-[var(--color-muted)]">
                        An unexpected error occurred. Our team has been notified.
                    </p>
                    {error.digest && (
                        <p className="text-xs font-mono text-[var(--color-muted)] bg-[var(--color-surface-2)] px-3 py-1 rounded-full inline-block">
                            {error.digest}
                        </p>
                    )}
                </div>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                    <RotateCcw className="size-4" /> Try again
                </button>
            </div>
        </div>
    )
}