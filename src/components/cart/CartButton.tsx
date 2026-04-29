'use client'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'

export function CartButton() {
    const { open, itemCount } = useCartStore()
    const count = itemCount()

    return (
        <button
            onClick={open}
            className="relative p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-2)] transition-colors"
            aria-label={`Cart (${count} items)`}
        >
            <ShoppingBag className="size-5" />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    )
}