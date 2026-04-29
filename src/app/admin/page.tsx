import type { Metadata } from 'next'
import { adminGetDashboardStats } from '@/lib/queries/admin'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
    const stats = await adminGetDashboardStats()

    const cards = [
        { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10' },
        { label: 'Total Orders', value: String(stats.totalOrders), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Products', value: String(stats.totalProducts), icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Users', value: String(stats.totalUsers), icon: Users, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-[var(--color-muted)] mt-1">Welcome back, admin.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
                        <div className={`size-9 rounded-[var(--radius-md)] ${bg} flex items-center justify-center`}>
                            <Icon className={`size-5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{value}</p>
                            <p className="text-xs text-[var(--color-muted)] mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, or remove products from the catalog.' },
                    { href: '/admin/orders', label: 'Manage Orders', desc: 'View and update order status.' },
                    { href: '/admin/users', label: 'Manage Users', desc: 'View users and manage roles.' },
                ].map(({ href, label, desc }) => (
                    <a
                        key={href}
                        href={href}
                        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-primary)] transition-all group"
                    >
                        <p className="font-semibold text-sm group-hover:text-[var(--color-accent)] transition-colors">{label}</p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">{desc}</p>
                    </a>
                ))}
            </div>
        </div >
    )
}