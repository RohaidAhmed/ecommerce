export default function Loading() {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="size-8 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-muted)]">Loading…</p>
            </div>
        </div>
    )
}