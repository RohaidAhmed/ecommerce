// app/(shop)/checkout/confirm/page.tsx

import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed' }

type Props = { searchParams: Promise<{ orderId?: string }> }

export default async function OrderConfirmPage({ searchParams }: Props) {
    const { orderId } = await searchParams

    let order: any = null
    let items: any[] = []

    if (orderId) {
        const supabase = await createServerClient()
        const { data } = await supabase
            .from('orders')
            .select('id, total_amount, status, created_at, shipping_address')
            .eq('id', orderId)
            .maybeSingle()

        order = data

        if (order) {
            const { data: oi } = await supabase
                .from('order_items')
                .select('quantity, unit_price, product:products(name, images)')
                .eq('order_id', orderId)

            items = oi ?? []
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            {/* Success icon */}
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-[#16a34a]" />
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-2">Order Confirmed!</h1>
            <p className="text-[#737373] mb-1">
                Thank you for your purchase. We&apos;ll send you shipping updates by email.
            </p>
            {order && (
                <p className="text-xs text-[#737373] font-mono mb-8">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
            )}

            {/* Order details */}
            {order && (
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 text-left mb-8">
                    <div className="flex items-center gap-2 mb-5">
                        <Package size={16} className="text-[#737373]" />
                        <span className="text-sm font-semibold">Order Details</span>
                    </div>

                    <div className="flex flex-col gap-4 mb-5">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-md bg-[#f5f5f5] overflow-hidden shrink-0">
                                    {item.product?.images?.[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.product?.name}</p>
                                    <p className="text-[#737373]">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">{formatPrice(item.unit_price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-4 flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>

                    {order.shipping_address && (
                        <div className="mt-4 border-t border-[#e5e5e5] pt-4 text-sm text-[#737373]">
                            <p className="font-semibold text-[#0f0f0f] mb-1">Shipping to</p>
                            <p>{order.shipping_address.line1}</p>
                            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                            <p>
                                {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                {order.shipping_address.postal_code}
                            </p>
                            <p>{order.shipping_address.country}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    href="/account/orders"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#0f0f0f] text-white rounded-md text-sm font-semibold hover:bg-[#262626] transition-colors"
                >
                    View my orders <ArrowRight size={14} />
                </Link>
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-[#e5e5e5] text-[#0f0f0f] rounded-md text-sm font-semibold hover:bg-[#f5f5f5] transition-colors"
                >
                    Continue shopping
                </Link>
            </div>
        </div>
    )
}