// components/cart/CartSummary.tsx

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Props = {
    subtotal: number
    itemCount: number
}

const FREE_SHIPPING_THRESHOLD = 75

export function CartSummary({ subtotal, itemCount }: Props) {
    const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD
    const shippingCost = shippingFree ? 0 : 8.99
    const total = subtotal + shippingCost
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal

    return (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex flex-col gap-5 sticky top-24">
            <h2 className="text-base font-bold">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-[#737373]">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-medium text-[#0f0f0f]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                    <span>Shipping</span>
                    <span className={`font-medium ${shippingFree ? 'text-[#16a34a]' : 'text-[#0f0f0f]'}`}>
                        {shippingFree ? 'Free' : formatPrice(shippingCost)}
                    </span>
                </div>

                {!shippingFree && (
                    <div className="rounded-md bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-2">
                        <p className="text-xs text-[#16a34a]">
                            Add {formatPrice(remaining)} more for free shipping
                        </p>
                        <div className="mt-1.5 h-1.5 rounded-full bg-[#dcfce7] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#16a34a] transition-all"
                                style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="border-t border-[#e5e5e5] pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            <Link
                href="/checkout"
                className="w-full h-12 bg-[#0f0f0f] text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors"
            >
                Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <p className="text-xs text-[#737373] text-center">
                Taxes calculated at checkout
            </p>
        </div>
    )
}