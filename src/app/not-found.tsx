import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="font-display text-[120px] font-bold leading-none text-[var(--color-border)] select-none">
                    404
                </div>
                <div className="space-y-2">
                    <h1 className="font-display text-2xl font-bold">Page not found</h1>
                    <p className="text-[var(--color-muted)]">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        <ArrowLeft className="size-4" /> Go home
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                        <Search className="size-4" /> Search products
                    </Link>
                </div>
            </div>
        </div>
    )
}