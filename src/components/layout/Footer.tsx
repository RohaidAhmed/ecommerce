import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <span className="font-display text-xl font-bold">Shop</span>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                            Quality products, thoughtfully curated.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Shop</h3>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted-fg)]">
                            <li><Link href="/products" className="hover:text-[var(--color-primary)] transition-colors">All Products</Link></li>
                            <li><Link href="/search" className="hover:text-[var(--color-primary)] transition-colors">Search</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Account</h3>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted-fg)]">
                            <li><Link href="/login" className="hover:text-[var(--color-primary)] transition-colors">Sign In</Link></li>
                            <li><Link href="/account/orders" className="hover:text-[var(--color-primary)] transition-colors">Orders</Link></li>
                            <li><Link href="/account/wishlist" className="hover:text-[var(--color-primary)] transition-colors">Wishlist</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted-fg)]">
                            <li><Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
                    © {new Date().getFullYear()} Shop. All rights reserved.
                </div>
            </div>
        </footer>
    )
}