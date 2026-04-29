import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getCartItems } from '@/lib/queries/cart'
import { CartPageClient } from '@/components/cart/CartPageClient'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Cart' }

export default async function CartPage() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const items = user ? await getCartItems(user.id) : []

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                    <ShoppingBag className="size-16 text-[var(--color-border)]" />
                    <div>
                        <p className="text-lg font-medium">Your cart is empty</p>
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                            {user ? 'Add some products to get started.' : 'Sign in to see your saved cart.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        >
                            Browse products <ArrowRight className="size-4" />
                        </Link>
                        {!user && (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <CartPageClient initialItems={items} />
            )}
        </div>
    )
}