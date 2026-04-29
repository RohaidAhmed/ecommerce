'use client'
import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist } from '@/lib/actions/wishlist.actions'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
    productId: string
    initialWishlisted?: boolean
}

export function WishlistButton({ productId, initialWishlisted = false }: WishlistButtonProps) {
    const [wishlisted, setWishlisted] = useState(initialWishlisted)
    const [isPending, startTransition] = useTransition()

    function handleToggle() {
        setWishlisted((v) => !v)
        startTransition(async () => {
            try {
                await toggleWishlist(productId)
            } catch {
                setWishlisted((v) => !v) // rollback on error
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
                'flex items-center justify-center gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium transition-all',
                wishlisted
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-[var(--color-border)] text-[var(--color-muted-fg)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)]',
                'disabled:opacity-50'
            )}
        >
            <Heart
                className={cn(
                    'size-4 transition-all',
                    wishlisted ? 'fill-red-500 text-red-500' : 'fill-transparent'
                )}
            />
            {wishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
    )
}