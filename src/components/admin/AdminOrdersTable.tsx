'use client'
import { useTransition } from 'react'
import { adminUpdateOrderStatus } from '@/lib/actions/admin.actions'
import { formatPrice, cn } from '@/lib/utils'
import type { Order } from '@/types'
import { redirect } from 'next/navigation'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
}

interface AdminOrdersTableProps { orders: Order[] }

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
    const [isPending, startTransition] = useTransition()

    function handleStatus(orderId: string, status: string) {
        startTransition(() => adminUpdateOrderStatus(orderId, status))
    }

    function handleRowClick(orderId: string) {
        redirect(`/admin/orders/${orderId}`) // Navigate to order details page
    }

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                        <tr>
                            {['Order', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-[var(--color-surface-2)] transition-colors" onClick={() => handleRowClick(order.id)}>
                                <td className="px-4 py-3 font-mono text-xs font-medium">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-muted-fg)] whitespace-nowrap">
                                    {new Date(order.created_at).toLocaleDateString('en-PK', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                </td>
                                <td className="px-4 py-3 text-xs font-mono text-[var(--color-muted)]">
                                    {order.user_id.slice(0, 8)}…
                                </td>
                                <td className="px-4 py-3 text-center text-[var(--color-muted-fg)]">
                                    {order.items?.length ?? 0}
                                </td>
                                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                                    {formatPrice(order.total_amount)}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-muted-fg)] uppercase text-xs">
                                    {(order as any).payment_method ?? 'cod'}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={order.status}
                                        disabled={isPending}
                                        onChange={(e) => handleStatus(order.id, e.target.value)}
                                        className={cn(
                                            'rounded-full px-2.5 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer',
                                            STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
                                        )}
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}