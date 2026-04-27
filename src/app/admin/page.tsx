// app/admin/page.tsx

import Link from 'next/link'
import {
    Package, ShoppingCart, Users, DollarSign,
    TrendingUp, AlertTriangle, ArrowRight,
} from 'lucide-react'
import { getDashboardStats } from '@/lib/queries/admin'
import { formatPrice, cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

const statusColors: Record<string, string> = {
    pending: 'bg-[#fef9c3] text-[#854d0e]',
    processing: 'bg-[#dbeafe] text-[#1e40af]',
    shipped: 'bg-[#e0e7ff] text-[#3730a3]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fee2e2] text-[#991b1b]',
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    const cards = [
        {
            label: 'Total Revenue',
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            color: 'text-[#16a34a]',
            bg: 'bg-[#f0fdf4]',
            href: '/admin/orders',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: 'text-[#1e40af]',
            bg: 'bg-[#eff6ff]',
            href: '/admin/orders',
        },
        {
            label: 'Products',
            value: stats.totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-[#7c3aed]',
            bg: 'bg-[#f5f3ff]',
            href: '/admin/products',
        },
        {
            label: 'Customers',
            value: stats.totalCustomers.toLocaleString(),
            icon: Users,
            color: 'text-[#0369a1]',
            bg: 'bg-[#f0f9ff]',
            href: '/admin/customers',
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-[#737373] mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white rounded-xl border border-[#e5e5e5] p-5 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', card.bg)}>
                                <card.icon size={18} className={card.color} />
                            </div>
                            <TrendingUp size={14} className="text-[#d4d4d4] group-hover:text-[#16a34a] transition-colors" />
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                        <p className="text-xs text-[#737373] mt-1">{card.label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">

                {/* Recent orders */}
                <div className="bg-white rounded-xl border border-[#e5e5e5]">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
                        <h2 className="font-semibold">Recent Orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-xs text-[#737373] flex items-center gap-1 hover:text-[#0f0f0f] transition-colors"
                        >
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-[#f5f5f5]">
                        {stats.recentOrders.length === 0 && (
                            <p className="px-6 py-8 text-sm text-[#737373] text-center">No orders yet.</p>
                        )}
                        {stats.recentOrders.map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fafafa] transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-xs text-[#737373]">
                                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', statusColors[order.status])}>
                                        {order.status}
                                    </span>
                                    <span className="text-sm font-semibold">{formatPrice(order.total_amount)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Low stock alert */}
                <div className="bg-white rounded-xl border border-[#e5e5e5]">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-[#e5e5e5]">
                        <AlertTriangle size={15} className="text-[#d97706]" />
                        <h2 className="font-semibold">Low Stock</h2>
                    </div>
                    <div className="divide-y divide-[#f5f5f5]">
                        {stats.lowStock.length === 0 && (
                            <p className="px-6 py-8 text-sm text-[#737373] text-center">All products well-stocked.</p>
                        )}
                        {stats.lowStock.map((product: any) => (
                            <Link
                                key={product.id}
                                href={`/admin/products/${product.id}/edit`}
                                className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fafafa] transition-colors"
                            >
                                <p className="text-sm font-medium line-clamp-1 flex-1 mr-2">{product.name}</p>
                                <span className={cn(
                                    'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
                                    product.inventory_count === 0
                                        ? 'bg-[#fee2e2] text-[#dc2626]'
                                        : 'bg-[#fef9c3] text-[#854d0e]'
                                )}>
                                    {product.inventory_count === 0 ? 'Out' : `${product.inventory_count} left`}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="px-6 py-3 border-t border-[#e5e5e5]">
                        <Link href="/admin/products" className="text-xs text-[#737373] hover:text-[#0f0f0f] flex items-center gap-1 transition-colors">
                            Manage inventory <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}