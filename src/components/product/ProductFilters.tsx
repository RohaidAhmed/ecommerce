'use client'

// components/product/ProductFilters.tsx

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

type Props = {
    categories: Category[]
    activeCategory?: string
    activeSort?: string
    total: number
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A–Z' },
]

export function ProductFilters({ categories, activeCategory, activeSort = 'newest', total }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const updateParam = useCallback(
        (key: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
            // Reset to page 1 on filter change
            params.delete('page')
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [pathname, router, searchParams]
    )

    const clearAll = () => router.push(pathname)

    const hasFilters = activeCategory || (activeSort && activeSort !== 'newest')

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0f0f0f]">
                    <SlidersHorizontal size={15} />
                    Filter
                </div>
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-[#737373] hover:text-[#0f0f0f] flex items-center gap-1 transition-colors"
                    >
                        <X size={11} /> Clear all
                    </button>
                )}
            </div>

            {/* Result count */}
            <p className="text-xs text-[#737373]">
                {total} {total === 1 ? 'product' : 'products'}
            </p>

            {/* Sort */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#737373] mb-3">Sort by</p>
                <div className="flex flex-col gap-1.5">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => updateParam('sort', opt.value === 'newest' ? null : opt.value)}
                            className={cn(
                                'text-left text-sm py-1 transition-colors',
                                activeSort === opt.value
                                    ? 'font-semibold text-[#0f0f0f]'
                                    : 'text-[#737373] hover:text-[#0f0f0f]'
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#e5e5e5]" />

            {/* Categories */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#737373] mb-3">Category</p>
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={() => updateParam('category', null)}
                        className={cn(
                            'text-left text-sm py-1 transition-colors',
                            !activeCategory
                                ? 'font-semibold text-[#0f0f0f]'
                                : 'text-[#737373] hover:text-[#0f0f0f]'
                        )}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateParam('category', cat.slug === activeCategory ? null : cat.slug)}
                            className={cn(
                                'text-left text-sm py-1 transition-colors',
                                activeCategory === cat.slug
                                    ? 'font-semibold text-[#0f0f0f]'
                                    : 'text-[#737373] hover:text-[#0f0f0f]'
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}


// ── Mobile filter toggle bar ─────────────────────────────────────────────────
export function MobileFilterBar({ total, activeSort = 'newest', onOpen }: {
    total: number
    activeSort?: string
    onOpen: () => void
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value === 'newest') {
            params.delete('sort')
        } else {
            params.set('sort', e.target.value)
        }
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-[#e5e5e5] lg:hidden">
            <p className="text-xs text-[#737373]">{total} products</p>
            <div className="flex items-center gap-2">
                <select
                    defaultValue={activeSort}
                    onChange={handleSort}
                    className="text-xs border border-[#e5e5e5] rounded-md px-2 py-1.5 bg-white text-[#0f0f0f] outline-none"
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <button
                    onClick={onOpen}
                    className="flex items-center gap-1.5 text-xs font-medium border border-[#e5e5e5] rounded-md px-3 py-1.5 bg-white hover:bg-[#f5f5f5] transition-colors"
                >
                    <SlidersHorizontal size={13} /> Filter
                </button>
            </div>
        </div>
    )
}