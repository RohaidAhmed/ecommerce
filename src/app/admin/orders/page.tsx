import type { Metadata } from 'next'
import { adminGetAllOrders } from '@/lib/queries/admin'
import { AdminOrdersTable } from '@/components/admin/AdminOrdersTable'

export const metadata: Metadata = { title: 'Orders — Admin' }

type Props = { searchParams: Promise<{ page?: string }> }

export default async function AdminOrdersPage({ searchParams }: Props) {
    const { page: pageStr } = await searchParams
    const page = Number(pageStr) || 1
    const { orders, count } = await adminGetAllOrders(page)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">Orders</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">{count} total orders</p>
                </div>
            </div>
            <AdminOrdersTable orders={orders} />
        </div>
    )
}