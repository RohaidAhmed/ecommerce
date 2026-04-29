'use client'
import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cart.store'
import { CartItemRow } from './CartItem'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
    const { items, isOpen, close, total } = useCartStore()
    const overlayRef = useRef<HTMLDivElement>(null)

    // Trap focus / close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') close()
        }
        if (isOpen) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, close])

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                ref={overlayRef}
                onClick={close}
                aria-hidden="true"
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            {/* Drawer panel */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[var(--color-surface)] shadow-[var(--shadow-xl)] transition-transform duration-300 ease-out"
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="size-5" />
                        <h2 className="font-semibold">Cart</h2>
                        {items.length > 0 && (
                            <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--color-muted-fg)]">
                                {items.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={close}
                        className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-2)] transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                            <ShoppingBag className="size-12 text-[var(--color-border)]" />
                            <div>
                                <p className="font-medium">Your cart is empty</p>
                                <p className="text-sm text-[var(--color-muted)] mt-1">
                                    Start adding some products!
                                </p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={close} asChild>
                                <Link href="/products">Browse products</Link>
                            </Button>
                        </div>
                    ) : (
                        <div>
                            {items.map((item) => (
                                <CartItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[var(--color-border)] px-5 py-5 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-muted-fg)]">Subtotal</span>
                            <span className="font-semibold text-base">{formatPrice(total())}</span>
                        </div>
                        <p className="text-xs text-[var(--color-muted)]">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Button variant="accent" size="lg" className="w-full" asChild>
                            <Link href="/checkout" onClick={close}>
                                Proceed to Checkout
                            </Link>
                        </Button>
                        <Button variant="ghost" size="md" className="w-full" onClick={close} asChild>
                            <Link href="/cart">View full cart</Link>
                        </Button>
                    </div>
                )}
            </aside>
        </>
    )
}