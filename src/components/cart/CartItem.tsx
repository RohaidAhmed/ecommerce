'use client'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { removeFromCart, updateCartQuantity } from '@/lib/actions/cart.actions'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
    item: CartItemType
}

export function CartItemRow({ item }: CartItemProps) {
    const { removeItem, updateQuantity } = useCartStore()

    async function handleRemove() {
        removeItem(item.id)
        await removeFromCart(item.id).catch(console.error)
    }

    async function handleQuantity(newQty: number) {
        if (newQty < 1) return handleRemove()
        updateQuantity(item.id, newQty)
        await updateCartQuantity(item.id, newQty).catch(console.error)
    }

    return (
        <div className="flex gap-3 py-4 border-b border-[var(--color-border)] last:border-0">
            {/* Image */}
            <div className="relative size-16 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-2)]">
                {item.product?.images?.[0] ? (
                    <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xl opacity-20">📦</div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug line-clamp-2">
                        {item.product?.name ?? 'Product'}
                    </p>
                    <button
                        onClick={handleRemove}
                        className="shrink-0 p-0.5 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                        aria-label="Remove item"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
                        <button
                            onClick={() => handleQuantity(item.quantity - 1)}
                            className="px-2 py-1 hover:bg-[var(--color-surface-2)] transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="size-3" />
                        </button>
                        <span className="px-3 py-1 text-sm min-w-[2rem] text-center border-x border-[var(--color-border)]">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantity(item.quantity + 1)}
                            className="px-2 py-1 hover:bg-[var(--color-surface-2)] transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="size-3" />
                        </button>
                    </div>

                    <span className="text-sm font-semibold">
                        {formatPrice((item.product?.price ?? 0) * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    )
}