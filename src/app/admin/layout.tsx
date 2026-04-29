import Link from 'next/link'
import { requireAdmin } from '@/lib/utils/auth'
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react'

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/users', label: 'Users', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin()

    return (
        <div className="flex min-h-[calc(100dvh-4rem)]">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-6 hidden md:block">
                <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Admin
                </p>
                <nav className="space-y-1">
                    {NAV.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted-fg)] hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <Icon className="size-4 shrink-0" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 p-6 lg:p-8">
                {children}
            </div>
        </div>
    )
}