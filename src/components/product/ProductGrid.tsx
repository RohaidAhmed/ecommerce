import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
    products: Product[]
    emptyMessage?: string
}

export function ProductGrid({ products, emptyMessage = 'No products found.' }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-[var(--color-muted-fg)]">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}