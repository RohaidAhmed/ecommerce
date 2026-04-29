import type { Metadata } from 'next'
import { requireUser } from '@/lib/utils/auth'
import { getWishlist } from '@/lib/queries/users'
import { WishlistGrid } from '@/components/account/WishlistGrid'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Wishlist' }

export default async function WishlistPage() {
    const user = await requireUser()
    const wishlist = await getWishlist(user.id)

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold">Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <Heart className="size-12 text-[var(--color-border)]" />
                    <div>
                        <p className="font-medium">Your wishlist is empty</p>
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                            Save products you love and come back to them later.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <WishlistGrid wishlist={wishlist} />
            )}
        </div>
    )
}