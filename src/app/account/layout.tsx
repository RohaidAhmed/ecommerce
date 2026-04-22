// app/account/layout.tsx

import Link from 'next/link'
import { requireUser } from '@/lib/utils/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getCartCount } from '@/lib/queries/cart'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth.actions'

const navItems = [
    { label: 'Profile', href: '/account', icon: User },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Settings', href: '/account/settings', icon: Settings },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    const user = await requireUser()
    const cartCount = await getCartCount(user.id)

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} cartCount={cartCount} />
            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-[220px_1fr] gap-10">

                    {/* Sidebar */}
                    <aside className="hidden lg:flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#737373] mb-3 px-3">
                            My Account
                        </p>
                        {navItems.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                            >
                                <Icon size={15} />
                                {label}
                            </Link>
                        ))}
                        <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                            <form action={logoutAction}>
                                <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#737373] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors w-full">
                                    <LogOut size={15} />
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* Content */}
                    <main>{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    )
}