'use client'

// components/cart/CartItem.tsx

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { updateCartItemAction, removeCartItemAction } from '@/lib/actions/cart.actions'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/types'

export function CartItemRow({ item }: { item: CartItem }) {
    const [pending, startTransition] = useTransition()
    const product = item.product!
    const image = product.images?.[0]

    const update = (qty: number) =>
        startTransition(() => updateCartItemAction(item.id, qty))

    const remove = () =>
        startTransition(() => removeCartItemAction(item.id))

    return (
        <div
            className={`flex gap-4 py-6 border-b border-[#e5e5e5] transition-opacity ${pending ? 'opacity-50 pointer-events-none' : ''
                }`}
        >
            {/* Image */}
            <Link href={`/products/${product.slug}`} className="shrink-0">
                <div className="relative w-20 h-24 sm:w-24 sm:h-32 rounded-lg overflow-hidden bg-[#f5f5f5]">
                    {image ? (
                        <Image src={image} alt={product.name} fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-[#f5f5f5]" />
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-medium text-[#0f0f0f] hover:underline underline-offset-2 line-clamp-2"
                    >
                        {product.name}
                    </Link>
                    <button
                        onClick={remove}
                        aria-label="Remove item"
                        className="shrink-0 p-1 text-[#737373] hover:text-[#dc2626] transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>

                <p className="text-sm font-semibold text-[#0f0f0f]">
                    {formatPrice(product.price)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-auto">
                    <button
                        onClick={() => update(item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-md border border-[#e5e5e5] flex items-center justify-center text-[#737373] hover:border-[#0f0f0f] hover:text-[#0f0f0f] transition-colors"
                    >
                        <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                        onClick={() => update(item.quantity + 1)}
                        aria-label="Increase quantity"
                        disabled={item.quantity >= (product.inventory_count ?? 99)}
                        className="w-7 h-7 rounded-md border border-[#e5e5e5] flex items-center justify-center text-[#737373] hover:border-[#0f0f0f] hover:text-[#0f0f0f] transition-colors disabled:opacity-30"
                    >
                        <Plus size={13} />
                    </button>

                    <span className="ml-auto text-sm font-semibold">
                        {formatPrice(product.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    )
}