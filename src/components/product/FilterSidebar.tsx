'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
    categories: Category[]
}

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low–High', value: 'price_asc' },
    { label: 'Price: High–Low', value: 'price_desc' },
]

export function FilterSidebar({ categories }: FilterSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const activeCategory = searchParams.get('category') ?? ''
    const activeSort = searchParams.get('sort') ?? 'newest'

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) params.set(key, value)
            else params.delete(key)
            params.delete('page') // reset pagination
            startTransition(() => router.push(`${pathname}?${params.toString()}`))
        },
        [pathname, router, searchParams]
    )

    return (
        <aside className={cn('w-56 shrink-0 space-y-8', isPending && 'opacity-60 pointer-events-none')}>
            {/* Categories */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
                    Category
                </h3>
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={() => updateParam('category', '')}
                            className={cn(
                                'w-full text-left px-3 py-1.5 rounded-[var(--radius-md)] text-sm transition-colors',
                                !activeCategory
                                    ? 'bg-[var(--color-primary)] text-white font-medium'
                                    : 'text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)]'
                            )}
                        >
                            All
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => updateParam('category', cat.slug)}
                                className={cn(
                                    'w-full text-left px-3 py-1.5 rounded-[var(--radius-md)] text-sm transition-colors',
                                    activeCategory === cat.slug
                                        ? 'bg-[var(--color-primary)] text-white font-medium'
                                        : 'text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)]'
                                )}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sort */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
                    Sort by
                </h3>
                <ul className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                        <li key={opt.value}>
                            <button
                                onClick={() => updateParam('sort', opt.value)}
                                className={cn(
                                    'w-full text-left px-3 py-1.5 rounded-[var(--radius-md)] text-sm transition-colors',
                                    activeSort === opt.value
                                        ? 'bg-[var(--color-primary)] text-white font-medium'
                                        : 'text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)]'
                                )}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}