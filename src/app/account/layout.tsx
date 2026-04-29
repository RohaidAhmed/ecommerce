import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/utils/auth'
import { logoutAction } from '@/lib/actions/auth.actions'
import { ShoppingBag, Heart, User, LogOut } from 'lucide-react'

export const metadata: Metadata = { title: { template: '%s | Account', default: 'Account' } }

const NAV = [
    { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/account/profile', label: 'Profile', icon: User },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
    await requireUser()

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                {/* Sidebar */}
                <aside className="lg:w-52 shrink-0">
                    <nav className="space-y-1">
                        {NAV.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] transition-colors"
                            >
                                <Icon className="size-4 shrink-0" />
                                {label}
                            </Link>
                        ))}

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-error)] transition-colors"
                            >
                                <LogOut className="size-4 shrink-0" />
                                Sign out
                            </button>
                        </form>
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    )
}