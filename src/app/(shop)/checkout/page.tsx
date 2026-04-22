// app/(shop)/checkout/page.tsx

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/utils/auth'
import { getCart } from '@/lib/queries/cart'
import { formatPrice } from '@/lib/utils'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
    const user = await requireUser()
    const items = await getCart(user.id)

    if (!items.length) redirect('/cart')

    const subtotal = items.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
    )
    const currency = process.env.PAYMENT_CURRENCY ?? 'USD'

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-10">Checkout</h1>

            <div className="grid lg:grid-cols-[1fr_380px] gap-10">
                {/* Left — address form */}
                <CheckoutForm userEmail={user.email ?? ''} />

                {/* Right — order summary */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 h-fit sticky top-24 flex flex-col gap-5">
                    <h2 className="font-bold text-base">Order Summary</h2>

                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-3 text-sm">
                                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[#f5f5f5] shrink-0">
                                    {item.product?.images?.[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#737373] text-white text-[9px] font-bold flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium line-clamp-1">{item.product?.name}</p>
                                    <p className="text-[#737373]">{formatPrice(item.product?.price ?? 0)}</p>
                                </div>
                                <p className="font-semibold shrink-0">
                                    {formatPrice((item.product?.price ?? 0) * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-4 flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-[#737373]">
                            <span>Subtotal</span>
                            <span className="text-[#0f0f0f] font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[#737373]">
                            <span>Shipping</span>
                            <span className={subtotal >= 75 ? 'text-[#16a34a] font-medium' : 'text-[#0f0f0f] font-medium'}>
                                {subtotal >= 75 ? 'Free' : formatPrice(8.99)}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t border-[#e5e5e5]">
                            <span>Total</span>
                            <span>{formatPrice(subtotal >= 75 ? subtotal : subtotal + 8.99)}</span>
                        </div>
                        <p className="text-xs text-[#737373] text-center mt-1">
                            Paid via {process.env.PAYMENT_PROVIDER ?? 'stripe'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}