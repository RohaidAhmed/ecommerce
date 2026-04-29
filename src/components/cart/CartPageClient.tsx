'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { removeFromCart, updateCartQuantity } from '@/lib/actions/cart.actions'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { CartItem } from '@/types'

interface CartPageClientProps {
    initialItems: CartItem[]
}

export function CartPageClient({ initialItems }: CartPageClientProps) {
    const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCartStore()

    // Hydrate Zustand from server-fetched items on mount
    useEffect(() => {
        initialItems.forEach((item) => {
            addItem(item)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const displayItems = items.length > 0 ? items : initialItems
    const subtotal = displayItems.reduce(
        (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
        0
    )

    async function handleRemove(id: string) {
        removeItem(id)
        await removeFromCart(id).catch(console.error)
    }

    async function handleQuantity(id: string, qty: number) {
        if (qty < 1) return handleRemove(id)
        updateQuantity(id, qty)
        await updateCartQuantity(id, qty).catch(console.error)
    }

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                {displayItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-6">
                        {/* Image */}
                        <Link href={`/products/${item.product?.slug ?? '#'}`} className="shrink-0">
                            <div className="relative size-24 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-2)]">
                                {item.product?.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">📦</div>
                                )}
                            </div>
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-0.5">
                                        {item.product?.category?.name}
                                    </p>
                                    <Link href={`/products/${item.product?.slug ?? '#'}`}>
                                        <p className="font-medium text-sm hover:text-[var(--color-accent)] transition-colors">
                                            {item.product?.name}
                                        </p>
                                    </Link>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="shrink-0 p-1 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                                    aria-label="Remove item"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                {/* Qty stepper */}
                                <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden text-sm">
                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors"
                                        aria-label="Decrease"
                                    >
                                        <Minus className="size-3" />
                                    </button>
                                    <span className="px-4 py-1.5 border-x border-[var(--color-border)] min-w-[3rem] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors"
                                        aria-label="Increase"
                                    >
                                        <Plus className="size-3" />
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-sm">
                                        {formatPrice((item.product?.price ?? 0) * item.quantity)}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-[var(--color-muted)]">
                                            {formatPrice(item.product?.price ?? 0)} each
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 space-y-4">
                    <h2 className="font-semibold text-base">Order Summary</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Subtotal ({itemCount()} items)</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Shipping</span>
                            <span className="text-[var(--color-success)]">
                                {subtotal >= 50 ? 'Free' : formatPrice(9.99)}
                            </span>
                        </div>
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Tax (est.)</span>
                            <span>{formatPrice(subtotal * 0.08)}</span>
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                            {formatPrice(subtotal + (subtotal >= 50 ? 0 : 9.99) + subtotal * 0.08)}
                        </span>
                    </div>

                    {subtotal > 0 && subtotal < 50 && (
                        <p className="text-xs text-[var(--color-accent)] font-medium">
                            Add {formatPrice(50 - subtotal)} more for free shipping!
                        </p>
                    )}

                    <Button variant="accent" size="lg" className="w-full" asChild>
                        <Link href="/checkout">
                            Checkout <ArrowRight className="size-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" size="md" className="w-full" asChild>
                        <Link href="/products">Continue shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}