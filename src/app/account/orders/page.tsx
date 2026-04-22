// app/account/orders/page.tsx

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { requireUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders' }

const statusStyles: Record<string, string> = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    processing: 'bg-[#dbeafe] text-[#1e40af]',
    shipped: 'bg-[#e0e7ff] text-[#3730a3]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fee2e2] text-[#991b1b]',
}

export default async function OrdersPage() {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight mb-8">My Orders</h1>

            {!orders?.length ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <Package size={40} className="text-[#d4d4d4] mb-4" />
                    <p className="font-medium mb-1">No orders yet</p>
                    <p className="text-sm text-[#737373] mb-6">
                        When you place an order it will appear here.
                    </p>
                    <Link
                        href="/products"
                        className="text-sm font-semibold text-[#0f0f0f] underline-offset-4 hover:underline"
                    >
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="flex items-center justify-between gap-4 bg-white rounded-xl border border-[#e5e5e5] px-5 py-4 hover:border-[#d4d4d4] hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-md bg-[#f5f5f5] flex items-center justify-center shrink-0">
                                    <Package size={18} className="text-[#737373]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold font-mono">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-[#737373] mt-0.5">
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span
                                    className={cn(
                                        'text-xs font-semibold px-2.5 py-1 rounded-full capitalize',
                                        statusStyles[order.status] ?? 'bg-[#f5f5f5] text-[#737373]'
                                    )}
                                >
                                    {order.status}
                                </span>
                                <p className="text-sm font-semibold hidden sm:block">
                                    {formatPrice(order.total_amount)}
                                </p>
                                <ChevronRight size={16} className="text-[#d4d4d4]" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}