import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/queries/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Pagination } from '@/components/product/Pagination'
import { SearchBar } from '@/components/product/SearchBar'

export const metadata: Metadata = { title: 'Search' }

type Props = { searchParams: Promise<{ q?: string; page?: string }> }

const PAGE_SIZE = 12

export default async function SearchPage({ searchParams }: Props) {
    const { q, page: pageStr } = await searchParams
    const page = Number(pageStr) || 1

    const { products, count } = q
        ? await getProducts({ search: q, page, limit: PAGE_SIZE })
        : { products: [], count: 0 }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold mb-6">Search</h1>

            <Suspense>
                <SearchBar initialValue={q} />
            </Suspense>

            {q ? (
                <div className="mt-10">
                    <p className="mb-6 text-sm text-[var(--color-muted)]">
                        {count} {count === 1 ? 'result' : 'results'} for &quot;{q}&quot;
                    </p>
                    <ProductGrid
                        products={products}
                        emptyMessage={`No products found for "${q}". Try a different search.`}
                    />
                    <Suspense>
                        <Pagination currentPage={page} totalCount={count} pageSize={PAGE_SIZE} />
                    </Suspense>
                </div>
            ) : (
                <p className="mt-12 text-center text-[var(--color-muted)]">
                    Enter a search term to find products.
                </p>
            )}
        </div>
    )
}