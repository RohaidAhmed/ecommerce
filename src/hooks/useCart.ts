import { useCartStore } from '@/store/cart.store'

export function useCart() {
    const store = useCartStore()
    return {
        items: store.items,
        isOpen: store.isOpen,
        open: store.open,
        close: store.close,
        toggle: store.toggle,
        addItem: store.addItem,
        removeItem: store.removeItem,
        updateQuantity: store.updateQuantity,
        clear: store.clear,
        total: store.total(),
        itemCount: store.itemCount(),
    }
}