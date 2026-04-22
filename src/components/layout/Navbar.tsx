'use client'

// components/layout/Navbar.tsx

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth.actions'
import { cn } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type NavbarProps = {
    user: SupabaseUser | null
    cartCount: number
}

const navLinks = [
    { label: 'Men', href: '/products?category=men' },
    { label: 'Women', href: '/products?category=women' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Sale', href: '/products?category=sale' },
]

export function Navbar({ user, cartCount }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [accountOpen, setAccountOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5]">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                {/* Mobile menu toggle */}
                <button
                    className="lg:hidden p-1 text-[#737373] hover:text-[#0f0f0f] transition-colors"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-[#0f0f0f] shrink-0"
                >
                    PALATE
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-[#737373] hover:text-[#0f0f0f] transition-colors"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                    {/* Search */}
                    <Link
                        href="/products"
                        className="p-2 text-[#737373] hover:text-[#0f0f0f] transition-colors"
                        aria-label="Search products"
                    >
                        <Search size={20} />
                    </Link>

                    {/* Account */}
                    {user ? (
                        <div className="relative">
                            <button
                                className="p-2 text-[#737373] hover:text-[#0f0f0f] transition-colors"
                                onClick={() => setAccountOpen((v) => !v)}
                                aria-label="Account"
                            >
                                <User size={20} />
                            </button>

                            {accountOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setAccountOpen(false)}
                                    />
                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-white rounded-md shadow-lg border border-[#e5e5e5] py-1 text-sm">
                                        <Link
                                            href="/account"
                                            className="block px-4 py-2 text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            My Account
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            className="block px-4 py-2 text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            Orders
                                        </Link>
                                        <Link
                                            href="/account/wishlist"
                                            className="block px-4 py-2 text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            Wishlist
                                        </Link>
                                        <hr className="my-1 border-[#e5e5e5]" />
                                        <form action={logoutAction}>
                                            <button
                                                type="submit"
                                                className="w-full text-left px-4 py-2 text-[#737373] hover:bg-[#f5f5f5] transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="p-2 text-[#737373] hover:text-[#0f0f0f] transition-colors"
                            aria-label="Sign in"
                        >
                            <User size={20} />
                        </Link>
                    )}

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative p-2 text-[#737373] hover:text-[#0f0f0f] transition-colors"
                        aria-label={`Cart (${cartCount} items)`}
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8440a] text-[10px] font-bold text-white leading-none">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Mobile drawer */}
            <div
                className={cn(
                    'lg:hidden border-t border-[#e5e5e5] overflow-hidden transition-all duration-300',
                    mobileOpen ? 'max-h-96' : 'max-h-0'
                )}
            >
                <ul className="flex flex-col px-4 py-4 gap-1 bg-white">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="block py-2.5 text-sm font-medium text-[#0f0f0f] border-b border-[#f5f5f5]"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {user ? (
                        <>
                            <li>
                                <Link
                                    href="/account"
                                    className="block py-2.5 text-sm font-medium text-[#0f0f0f] border-b border-[#f5f5f5]"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <form action={logoutAction}>
                                    <button className="py-2.5 text-sm font-medium text-[#737373]">
                                        Sign out
                                    </button>
                                </form>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link
                                href="/login"
                                className="block py-2.5 text-sm font-medium text-[#0f0f0f]"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign in
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    )
}