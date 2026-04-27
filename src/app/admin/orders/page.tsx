// app/admin/orders/page.tsx

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getAdminOrders } from '@/lib/queries/admin'
import { formatPrice, cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders — Admin' }

type Props = { searchParams: Promise<{ page?: string; status?: string }> }

const ALL_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    processing: 'bg-[#dbeafe] text-[#1e40af]',
    shipped: 'bg-[#e0e7ff] text-[#3730a3]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fee2e2] text-[#991b1b]',
}

export default async function AdminOrdersPage({ searchParams }: Props) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page ?? '1', 10))
    const status = sp.status ?? 'all'

    const { orders, total, pageCount } = await getAdminOrders({ page, status })

    function buildHref(p: number) {
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)
        if (p > 1) params.set('page', String(p))
        const qs = params.toString()
        return `/admin/orders${qs ? `?${qs}` : ''}`
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <p className="text-sm text-[#737373] mt-0.5">{total} total</p>
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 flex-wrap">
                {ALL_STATUSES.map((s) => (
                    <Link
                        key={s}
                        href={s === 'all' ? '/admin/orders' : `/admin/orders?status=${s}`}
                        className={cn(
                            'px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors',
                            status === s
                                ? 'bg-[#0f0f0f] text-white'
                                : 'bg-white border border-[#e5e5e5] text-[#737373] hover:text-[#0f0f0f]'
                        )}
                    >
                        {s}
                    </Link>
                ))}
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Order</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f5f5]">
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#737373]">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-xs text-[#737373]">
                                            {(order.shipping_address as any)?.city ?? '—'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-[#737373] hidden sm:table-cell">
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'text-xs font-semibold px-2.5 py-1 rounded-full capitalize',
                                            statusColors[order.status] ?? 'bg-[#f5f5f5] text-[#737373]'
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        {formatPrice(order.total_amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors inline-flex"
                                        >
                                            <ChevronRight size={15} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
        </div>
    )
}