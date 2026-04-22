// app/account/orders/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package } from 'lucide-react'
import { requireUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'
import { formatPrice, cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Detail' }

type Props = { params: Promise<{ id: string }> }

const statusStyles: Record<string, string> = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    processing: 'bg-[#dbeafe] text-[#1e40af]',
    shipped: 'bg-[#e0e7ff] text-[#3730a3]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fee2e2] text-[#991b1b]',
}

const steps = ['pending', 'processing', 'shipped', 'delivered']

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params
    const user = await requireUser()
    const supabase = await createServerClient()

    const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle()

    if (!order) notFound()

    const { data: items } = await supabase
        .from('order_items')
        .select('id, quantity, unit_price, product:products(name, slug, images)')
        .eq('order_id', id)

    const currentStep = steps.indexOf(order.status)
    const addr = order.shipping_address as any

    return (
        <div>
            <Link
                href="/account/orders"
                className="inline-flex items-center gap-1.5 text-sm text-[#737373] hover:text-[#0f0f0f] mb-6 transition-colors"
            >
                <ArrowLeft size={14} /> Back to orders
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-[#737373] mt-1">
                        Placed on{' '}
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </p>
                </div>
                <span
                    className={cn(
                        'text-xs font-semibold px-3 py-1.5 rounded-full capitalize',
                        statusStyles[order.status] ?? 'bg-[#f5f5f5] text-[#737373]'
                    )}
                >
                    {order.status}
                </span>
            </div>

            {/* Progress tracker */}
            {order.status !== 'cancelled' && (
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 mb-6">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[#e5e5e5] z-0" />
                        <div
                            className="absolute top-3.5 left-0 h-0.5 bg-[#0f0f0f] z-0 transition-all duration-500"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                        {steps.map((step, i) => (
                            <div key={step} className="flex flex-col items-center gap-2 z-10">
                                <div
                                    className={cn(
                                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                                        i <= currentStep
                                            ? 'bg-[#0f0f0f] border-[#0f0f0f] text-white'
                                            : 'bg-white border-[#e5e5e5] text-[#737373]'
                                    )}
                                >
                                    {i < currentStep ? '✓' : i + 1}
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373] capitalize hidden sm:block">
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
                {/* Items */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Package size={15} /> Items ({items?.length ?? 0})
                    </h2>
                    <div className="flex flex-col gap-4">
                        {items?.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="w-12 h-12 rounded-md bg-[#f5f5f5] overflow-hidden shrink-0">
                                    {(item.product as any)?.images?.[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={(item.product as any).images[0]}
                                            alt={(item.product as any).name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{(item.product as any)?.name}</p>
                                    <p className="text-xs text-[#737373]">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold shrink-0">
                                    {formatPrice(item.unit_price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#e5e5e5] mt-4 pt-3 flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                {/* Shipping address */}
                {addr && (
                    <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
                        <h2 className="font-semibold mb-4">Shipping Address</h2>
                        <div className="text-sm text-[#737373] flex flex-col gap-1">
                            <p>{addr.line1}</p>
                            {addr.line2 && <p>{addr.line2}</p>}
                            <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                            <p>{addr.country}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}