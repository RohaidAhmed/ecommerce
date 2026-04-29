'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTransition } from 'react'
import { removeFromWishlist } from '@/lib/actions/wishlist.actions'
import { formatPrice } from '@/lib/utils'
import { X, ShoppingBag } from 'lucide-react'
import { addToCart } from '@/lib/actions/cart.actions'
import { useCartStore } from '@/store/cart.store'
import type { Wishlist } from '@/types'

interface WishlistGridProps { wishlist: Wishlist[] }

export function WishlistGrid({ wishlist }: WishlistGridProps) {
    const [isPending, startTransition] = useTransition()
    const { open } = useCartStore()

    function handleRemove(wishlistId: string) {
        startTransition(() => removeFromWishlist(wishlistId))
    }

    function handleAddToCart(productId: string) {
        startTransition(async () => {
            await addToCart(productId, 1)
            open()
        })
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {wishlist.map(({ id, product }) => {
                if (!product) return null
                return (
                    <div
                        key={id}
                        className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow"
                    >
                        {/* Remove */}
                        <button
                            onClick={() => handleRemove(id)}
                            disabled={isPending}
                            className="absolute top-2 right-2 z-10 size-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors shadow-sm"
                            aria-label="Remove from wishlist"
                        >
                            <X className="size-3.5" />
                        </button>

                        {/* Image */}
                        <Link href={`/products/${product.slug}`}>
                            <div className="relative aspect-square bg-[var(--color-surface-2)] overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">📦</div>
                                )}
                            </div>
                        </Link>

                        {/* Info */}
                        <div className="p-3 space-y-2">
                            <Link href={`/products/${product.slug}`}>
                                <p className="text-sm font-medium leading-snug line-clamp-2 hover:text-[var(--color-accent)] transition-colors">
                                    {product.name}
                                </p>
                            </Link>
                            <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={isPending || product.inventory_count === 0}
                                className="w-full flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] py-1.5 text-xs font-medium hover:bg-[var(--color-surface-2)] disabled:opacity-50 transition-colors"
                            >
                                <ShoppingBag className="size-3.5" />
                                {product.inventory_count === 0 ? 'Out of stock' : 'Add to cart'}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}