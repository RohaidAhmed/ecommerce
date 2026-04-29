import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

type CartStore = {
    items: CartItem[]
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clear: () => void
    total: () => number
    itemCount: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            open: () => set({ isOpen: true }),
            close: () => set({ isOpen: false }),
            toggle: () => set((s) => ({ isOpen: !s.isOpen })),
            addItem: (item) => set((state) => {
                const existing = state.items.find((i) => i.product_id === item.product_id)
                if (existing) {
                    return {
                        items: state.items.map((i) =>
                            i.product_id === item.product_id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    }
                }
                return { items: [...state.items, item] }
            }),
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                })),
            clear: () => set({ items: [] }),
            total: () =>
                get().items.reduce(
                    (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
                    0
                ),
            itemCount: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: 'cart-storage' }
    )
)