import Link from 'next/link'
import { ShoppingBag, Search, User } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { CartButton } from '@/components/cart/CartButton'

export async function Navbar() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="font-display text-xl font-bold tracking-tight">
                    Shop
                </Link>

                {/* Center nav */}
                <ul className="hidden md:flex items-center gap-8 text-sm">
                    <li><Link href="/products" className="text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] transition-colors">Products</Link></li>
                    <li><Link href="/categories/all" className="text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] transition-colors">Categories</Link></li>
                    <li><Link href="/search" className="text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] transition-colors">Search</Link></li>
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/search" className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-2)] transition-colors" aria-label="Search">
                        <Search className="size-5" />
                    </Link>

                    <CartButton />

                    {user ? (
                        <Link href="/account/orders" className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-2)] transition-colors" aria-label="Account">
                            <User className="size-5" />
                        </Link>
                    ) : (
                        <Link href="/login" className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">
                            Sign in
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}