// app/(shop)/products/page.tsx

import { Suspense } from 'react'
import { getProducts, getCategories, getPriceRange } from '@/lib/queries/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { SearchBar } from '@/components/product/SearchBar'
import { Pagination } from '@/components/ui/Pagination'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'All Products',
    description: 'Browse our full collection of curated essentials.',
}

type SearchParams = {
    category?: string
    sort?: string
    search?: string
    page?: string
    minPrice?: string
    maxPrice?: string
}

type Props = {
    searchParams: Promise<SearchParams>
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams

    const page = Math.max(1, parseInt(params.page ?? '1', 10))
    const sort = (params.sort ?? 'newest') as 'newest' | 'price_asc' | 'price_desc' | 'name_asc'

    const [{ products, total, pageCount }, categories] = await Promise.all([
        getProducts({
            category: params.category,
            sort,
            search: params.search,
            minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
            page,
        }),
        getCategories(),
    ])

    // Build paginated URL preserving all other params
    function buildHref(p: number) {
        const sp = new URLSearchParams()
        if (params.category) sp.set('category', params.category)
        if (params.sort) sp.set('sort', params.sort)
        if (params.search) sp.set('search', params.search)
        if (params.minPrice) sp.set('minPrice', params.minPrice)
        if (params.maxPrice) sp.set('maxPrice', params.maxPrice)
        if (p > 1) sp.set('page', String(p))
        const qs = sp.toString()
        return `/products${qs ? `?${qs}` : ''}`
    }

    // Active category name for breadcrumb
    const activeCategoryName = params.category
        ? categories.find((c) => c.slug === params.category)?.name
        : null

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Breadcrumb */}
            <nav className="text-xs text-[#737373] mb-6 flex items-center gap-1.5">
                <a href="/" className="hover:text-[#0f0f0f] transition-colors">Home</a>
                <span>/</span>
                <a href="/products" className="hover:text-[#0f0f0f] transition-colors">Products</a>
                {activeCategoryName && (
                    <>
                        <span>/</span>
                        <span className="text-[#0f0f0f] font-medium">{activeCategoryName}</span>
                    </>
                )}
            </nav>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {activeCategoryName ?? 'All Products'}
                </h1>
                {params.search && (
                    <p className="mt-2 text-sm text-[#737373]">
                        Results for <span className="font-medium text-[#0f0f0f]">"{params.search}"</span>
                    </p>
                )}
            </div>

            {/* Search + layout */}
            <div className="mb-6">
                <Suspense>
                    <SearchBar defaultValue={params.search} />
                </Suspense>
            </div>

            <div className="flex gap-10">
                {/* Sidebar filters — desktop only */}
                <aside className="hidden lg:block w-52 shrink-0">
                    <div className="sticky top-24">
                        <Suspense>
                            <ProductFilters
                                categories={categories}
                                activeCategory={params.category}
                                activeSort={sort}
                                total={total}
                            />
                        </Suspense>
                    </div>
                </aside>

                {/* Product grid */}
                <div className="flex-1 min-w-0">
                    <Suspense fallback={<ProductGridSkeleton />}>
                        <ProductGrid
                            products={products}
                            emptyMessage={
                                params.search
                                    ? `No products matched "${params.search}". Try a different term.`
                                    : 'No products in this category yet.'
                            }
                        />
                    </Suspense>

                    <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
                </div>
            </div>
        </div>
    )
}