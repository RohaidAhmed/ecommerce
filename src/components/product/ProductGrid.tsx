// components/product/ProductGrid.tsx

import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'

type Props = {
    products: Product[]
    loading?: boolean
    emptyMessage?: string
}

export function ProductGrid({ products, loading, emptyMessage = 'No products found.' }: Props) {
    if (loading) return <ProductGridSkeleton />

    if (!products.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-4xl mb-4">🛍️</p>
                <p className="text-base font-medium text-[#0f0f0f] mb-1">Nothing here yet</p>
                <p className="text-sm text-[#737373]">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
        </div>
    )
}