// app/admin/layout.tsx

import Link from 'next/link'
import { requireAdmin } from '@/lib/utils/auth'
import { logoutAction } from '@/lib/actions/auth.actions'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    LogOut,
    Store,
} from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin()

    return (
        <div className="min-h-screen flex bg-[#fafafa]">

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-[#0f0f0f] text-white shrink-0 sticky top-0 h-screen">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#e8440a] rounded-md flex items-center justify-center">
                            <Store size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Guppu Baby Admin</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                    {navItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Icon size={15} />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-3 pb-4 border-t border-white/10 pt-4 flex flex-col gap-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Store size={15} /> View Store
                    </Link>
                    <form action={logoutAction}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                            <LogOut size={15} /> Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-14 bg-white border-b border-[#e5e5e5] flex items-center px-6 justify-between shrink-0">
                    <h1 className="text-sm font-semibold text-[#0f0f0f]">Admin Panel</h1>
                    <Link
                        href="/"
                        className="text-xs text-[#737373] hover:text-[#0f0f0f] transition-colors"
                    >
                        ← Back to store
                    </Link>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}