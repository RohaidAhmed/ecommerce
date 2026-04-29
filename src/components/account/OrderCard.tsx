'use client'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { cancelOrder } from '@/lib/actions/order.actions'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'
import { ChevronDown, ChevronUp, Banknote } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
}

interface OrderCardProps { order: Order }

export function OrderCard({ order }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [localStatus, setLocalStatus] = useState(order.status)

    const canCancel = localStatus === 'pending'

    function handleCancel() {
        startTransition(async () => {
            await cancelOrder(order.id)
            setLocalStatus('cancelled')
        })
    }

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface-2)] px-5 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-0.5">Order</p>
                        <p className="font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-0.5">Date</p>
                        <p className="font-medium">
                            {new Date(order.created_at).toLocaleDateString('en-PK', {
                                day: 'numeric', month: 'short', year: 'numeric',
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-0.5">Total</p>
                        <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-0.5">Payment</p>
                        <div className="flex items-center gap-1">
                            <Banknote className="size-3.5 text-[var(--color-muted)]" />
                            <p className="font-medium capitalize">{(order as any).payment_method ?? 'COD'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[localStatus] ?? STATUS_STYLES.pending
                    )}>
                        {STATUS_LABELS[localStatus] ?? localStatus}
                    </span>

                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-xs text-[var(--color-error)] hover:underline disabled:opacity-50"
                        >
                            {isPending ? 'Cancelling…' : 'Cancel order'}
                        </button>
                    )}

                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-border)] transition-colors"
                        aria-label={expanded ? 'Collapse' : 'Expand'}
                    >
                        {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                </div>
            </div>

            {/* Items (expandable) */}
            {expanded && order.items && (
                <div className="divide-y divide-[var(--color-border)] px-5">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                            <div className="relative size-12 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-2)]">
                                {item.product?.images?.[0] ? (
                                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-lg opacity-20">📦</div>
                                )}
                            </div>
                            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{item.product?.name ?? 'Product'}</p>
                                    <p className="text-xs text-[var(--color-muted)]">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold shrink-0">
                                    {formatPrice(item.unit_price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Shipping address */}
                    {order.shipping_address && (
                        <div className="py-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                                Delivery Address
                            </p>
                            <address className="not-italic text-sm text-[var(--color-muted-fg)] leading-relaxed">
                                {order.shipping_address.line1}
                                {order.shipping_address.line2 && <>, {order.shipping_address.line2}</>}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                                {order.shipping_address.country}
                            </address>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}