'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalCount: number
    pageSize: number
}

export function Pagination({ currentPage, totalCount, pageSize }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const totalPages = Math.ceil(totalCount / pageSize)

    if (totalPages <= 1) return null

    const goTo = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(page))
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center justify-center gap-2 pt-10">
            <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] disabled:opacity-40 hover:bg-[var(--color-surface-2)] transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…')
                    acc.push(p)
                    return acc
                }, [])
                .map((item, idx) =>
                    item === '…' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-[var(--color-muted)]">…</span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => goTo(item as number)}
                            className={cn(
                                'size-9 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                                currentPage === item
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
                            )}
                        >
                            {item}
                        </button>
                    )
                )}

            <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] disabled:opacity-40 hover:bg-[var(--color-surface-2)] transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    )
}