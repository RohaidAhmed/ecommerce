import type { Metadata } from 'next'
import { requireUser } from '@/lib/utils/auth'
import { getUserOrders } from '@/lib/queries/orders'
import { OrderCard } from '@/components/account/OrderCard'
import { PackageSearch } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Orders' }

export default async function OrdersPage() {
    const user = await requireUser()
    const orders = await getUserOrders(user.id)

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold">My Orders</h1>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <PackageSearch className="size-12 text-[var(--color-border)]" />
                    <div>
                        <p className="font-medium">No orders yet</p>
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                            Once you place an order, it will appear here.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}