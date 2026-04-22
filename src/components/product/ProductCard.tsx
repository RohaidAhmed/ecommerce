// components/product/ProductCard.tsx

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

type Props = {
    product: Product
    priority?: boolean
}

export function ProductCard({ product, priority = false }: Props) {
    const isOnSale =
        product.compare_at_price != null && product.compare_at_price > product.price
    const isOutOfStock = product.inventory_count === 0
    const image = product.images?.[0]

    return (
        <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
            {/* Image container */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#f5f5f5]">
                {image ? (
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        priority={priority}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#d4d4d4]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isOnSale && (
                        <span className="bg-[#e8440a] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Sale
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-[#0f0f0f]/80 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                            Sold out
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    aria-label="Add to wishlist"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-[#737373] opacity-0 group-hover:opacity-100 hover:text-[#e8440a] hover:bg-white transition-all duration-200"
                    onClick={(e) => e.preventDefault()} // handled in detail page
                >
                    <Heart size={14} />
                </button>

                {/* Quick-add overlay on hover */}
                {!isOutOfStock && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-[#0f0f0f]/90 text-white text-xs font-semibold text-center py-3 tracking-wide">
                            Quick view
                        </div>
                    </div>
                )}
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-1">
                {product.category && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#737373]">
                        {product.category.name}
                    </p>
                )}
                <p className="text-sm font-medium text-[#0f0f0f] line-clamp-1 group-hover:underline underline-offset-2 transition-all">
                    {product.name}
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm font-semibold ${isOnSale ? 'text-[#e8440a]' : 'text-[#0f0f0f]'}`}
                    >
                        {formatPrice(product.price)}
                    </span>
                    {isOnSale && (
                        <span className="text-xs text-[#737373] line-through">
                            {formatPrice(product.compare_at_price!)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}