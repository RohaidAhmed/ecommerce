// app/(shop)/cart/page.tsx

import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/utils/auth'
import { getCart } from '@/lib/queries/cart'
import { CartItemRow } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Your Cart' }

export default async function CartPage() {
    const user = await requireUser()
    const items = await getCart(user.id)

    const subtotal = items.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
    )
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                <Link
                    href="/products"
                    className="text-sm text-[#737373] flex items-center gap-1.5 hover:text-[#0f0f0f] transition-colors"
                >
                    <ArrowLeft size={14} /> Continue shopping
                </Link>
            </div>

            {items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-[#d4d4d4]" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-sm text-[#737373] mb-8 max-w-xs">
                        Looks like you haven't added anything yet. Start browsing to find something you love.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-[#0f0f0f] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#262626] transition-colors"
                    >
                        Shop now
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr_360px] gap-10">
                    {/* Items list */}
                    <div>
                        {items.map((item) => (
                            <CartItemRow key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Summary */}
                    <CartSummary subtotal={subtotal} itemCount={itemCount} />
                </div>
            )}
        </div>
    )
}