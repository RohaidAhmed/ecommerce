import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/product/FilterSidebar'
import { Pagination } from '@/components/product/Pagination'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort?: string; page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    return { title }
}

const PAGE_SIZE = 12

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params
    const sp = await searchParams
    const page = Number(sp.page) || 1

    const [{ products, count }, categories] = await Promise.all([
        getProducts({ category: slug, sort: sp.sort as any, page, limit: PAGE_SIZE }),
        getCategories(),
    ])

    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold">{categoryName}</h1>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {count} {count === 1 ? 'product' : 'products'}
                </p>
            </div>

            <div className="flex gap-10">
                <Suspense>
                    <FilterSidebar categories={categories} />
                </Suspense>
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