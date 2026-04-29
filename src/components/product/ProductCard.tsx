import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const isOnSale = product.compare_at_price && product.compare_at_price > product.price
    const discount = isOnSale
        ? Math.round((1 - product.price / product.compare_at_price!) * 100)
        : null

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)] hover:shadow-[var(--shadow-lg)] transition-all duration-200"
        >
            {/* Image */}
            <div className="relative aspect-square bg-[var(--color-surface-2)] overflow-hidden">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl opacity-20">📦</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discount && (
                        <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                            -{discount}%
                        </span>
                    )}
                    {product.inventory_count === 0 && (
                        <span className="rounded-full bg-[var(--color-primary)]/80 px-2 py-0.5 text-[10px] font-medium text-white">
                            Sold out
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 p-4 flex-1">
                {product.category && (
                    <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                        {product.category.name}
                    </p>
                )}
                <h3 className="text-sm font-medium leading-snug group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <div className="mt-auto pt-2 flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                    {isOnSale && (
                        <span className="text-xs text-[var(--color-muted)] line-through">
                            {formatPrice(product.compare_at_price!)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}