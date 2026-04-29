function SkeletonCard() {
    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[var(--color-surface-2)]" />
            <div className="p-4 space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-[var(--color-border)]" />
                <div className="h-3.5 w-full rounded-full bg-[var(--color-border)]" />
                <div className="h-3.5 w-2/3 rounded-full bg-[var(--color-border)]" />
                <div className="h-4 w-20 rounded-full bg-[var(--color-border)] mt-3" />
            </div>
        </div>
    )
}

export default function ProductsLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-2">
                <div className="h-8 w-48 rounded-lg bg-[var(--color-surface-2)] animate-pulse" />
                <div className="h-4 w-24 rounded-full bg-[var(--color-surface-2)] animate-pulse" />
            </div>
            <div className="flex gap-10">
                <div className="w-56 shrink-0 space-y-6">
                    {[80, 60, 70, 50, 65].map((w) => (
                        <div key={w} className="h-4 rounded-full bg-[var(--color-surface-2)] animate-pulse" style={{ width: `${w}%` }} />
                    ))}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        </div>
    )
}