import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/product/FilterSidebar'
import { Pagination } from '@/components/product/Pagination'

export const metadata: Metadata = { title: 'Products' }

const PAGE_SIZE = 12
export const revalidate = 60 // revalidate every 60 seconds

type Props = {
    searchParams: Promise<{
        category?: string
        search?: string
        sort?: string
        page?: string
        min_price?: string
        max_price?: string
    }>
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams
    const page = Number(params.page) || 1

    const [{ products, count }, categories] = await Promise.all([
        getProducts({
            category: params.category,
            search: params.search,
            sort: params.sort as any,
            page,
            limit: PAGE_SIZE,
            min_price: params.min_price ? Number(params.min_price) : undefined,
            max_price: params.max_price ? Number(params.max_price) : undefined,
        }),
        getCategories(),
    ])

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold">
                    {params.search ? `Results for "${params.search}"` : 'All Products'}
                </h1>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {count} {count === 1 ? 'product' : 'products'}
                </p>
            </div>

            <div className="flex gap-10">
                {/* Sidebar */}
                <Suspense>
                    <FilterSidebar categories={categories} />
                </Suspense>

                {/* Main */}
                <div className="flex-1 min-w-0">
                    <ProductGrid products={products} />
                    <Suspense>
                        <Pagination currentPage={page} totalCount={count} pageSize={PAGE_SIZE} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}