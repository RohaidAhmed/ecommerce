// components/ui/Pagination.tsx

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    page: number
    pageCount: number
    buildHref: (page: number) => string
}

export function Pagination({ page, pageCount, buildHref }: Props) {
    if (pageCount <= 1) return null

    const pages = getPaginationRange(page, pageCount)

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12">
            {/* Prev */}
            {page > 1 ? (
                <Link
                    href={buildHref(page - 1)}
                    className="p-2 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </Link>
            ) : (
                <span className="p-2 rounded-md text-[#d4d4d4] cursor-not-allowed">
                    <ChevronLeft size={16} />
                </span>
            )}

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-[#737373]">
                        …
                    </span>
                ) : (
                    <Link
                        key={p}
                        href={buildHref(p as number)}
                        className={cn(
                            'w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                            p === page
                                ? 'bg-[#0f0f0f] text-white'
                                : 'text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5]'
                        )}
                        aria-current={p === page ? 'page' : undefined}
                    >
                        {p}
                    </Link>
                )
            )}

            {/* Next */}
            {page < pageCount ? (
                <Link
                    href={buildHref(page + 1)}
                    className="p-2 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </Link>
            ) : (
                <span className="p-2 rounded-md text-[#d4d4d4] cursor-not-allowed">
                    <ChevronRight size={16} />
                </span>
            )}
        </nav>
    )
}

function getPaginationRange(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]

    return [1, '...', current - 1, current, current + 1, '...', total]
}