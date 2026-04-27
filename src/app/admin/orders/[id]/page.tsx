// app/admin/orders/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminOrderById } from '@/lib/queries/admin'
import { updateOrderStatusAction } from '@/lib/actions/admin.actions'
import { formatPrice, cn } from '@/lib/utils'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Detail — Admin' }

type Props = { params: Promise<{ id: string }> }

const statusColors: Record<string, string> = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    processing: 'bg-[#dbeafe] text-[#1e40af]',
    shipped: 'bg-[#e0e7ff] text-[#3730a3]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fee2e2] text-[#991b1b]',
}

export default async function AdminOrderDetailPage({ params }: Props) {
    const { id } = await params
    const { order, items } = await getAdminOrderById(id)
    if (!order) notFound()

    const addr = order.shipping_address as any

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/orders"
                    className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-[#737373]">
                        {new Date(order.created_at).toLocaleString('en-US', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                        })}
                    </p>
                </div>
                <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full capitalize', statusColors[order.status])}>
                    {order.status}
                </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Items */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e5e5] p-5">
                    <h2 className="font-semibold mb-4">Items ({items.length})</h2>
                    <div className="flex flex-col gap-4">
                        {items.map((item: any) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="w-12 h-12 rounded-md bg-[#f5f5f5] overflow-hidden shrink-0">
                                    {item.product?.images?.[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                                    <p className="text-xs text-[#737373]">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
                                </div>
                                <p className="text-sm font-semibold shrink-0">
                                    {formatPrice(item.unit_price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#e5e5e5] mt-4 pt-3 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">

                    {/* Update status */}
                    <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
                        <h2 className="font-semibold mb-4">Update Status</h2>
                        <OrderStatusUpdater
                            orderId={order.id}
                            currentStatus={order.status}
                            action={updateOrderStatusAction}
                        />
                    </div>

                    {/* Shipping address */}
                    {addr && (
                        <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
                            <h2 className="font-semibold mb-3">Ship to</h2>
                            <div className="text-sm text-[#737373] flex flex-col gap-0.5">
                                <p>{addr.line1}</p>
                                {addr.line2 && <p>{addr.line2}</p>}
                                <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                                <p>{addr.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Payment info */}
                    <div className="bg-white rounded-xl border border-[#e5e5e5] p-5">
                        <h2 className="font-semibold mb-3">Payment</h2>
                        <div className="text-sm text-[#737373] flex flex-col gap-1">
                            <div className="flex justify-between">
                                <span>Provider</span>
                                <span className="font-medium text-[#0f0f0f] capitalize">
                                    {process.env.PAYMENT_PROVIDER ?? 'stripe'}
                                </span>
                            </div>
                            {order.stripe_payment_intent_id && (
                                <div className="flex justify-between gap-2">
                                    <span className="shrink-0">Ref</span>
                                    <span className="font-mono text-xs truncate">{order.stripe_payment_intent_id}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}