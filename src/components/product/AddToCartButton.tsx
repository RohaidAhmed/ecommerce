'use client'
import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { addToCart } from '@/lib/actions/cart.actions'
import { useCartStore } from '@/store/cart.store'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

interface AddToCartButtonProps {
    product: Product
    quantity?: number
}

export function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const { addItem, open } = useCartStore()

    const outOfStock = product.inventory_count === 0

    async function handleAddToCart() {
        setLoading(true)
        try {
            await addToCart(product.id, quantity)
            // Optimistic update for Zustand (guest-mode fallback)
            addItem({
                id: crypto.randomUUID(),
                cart_id: '',
                product_id: product.id,
                variant_id: null,
                quantity,
                product,
            })
            setAdded(true)
            open()
            setTimeout(() => setAdded(false), 2500)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (outOfStock) {
        return (
            <Button variant="secondary" size="lg" disabled className="w-full">
                Out of Stock
            </Button>
        )
    }

    return (
        <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={handleAddToCart}
            className="w-full gap-2"
        >
            {added ? (
                <><Check className="size-4" /> Added to cart</>
            ) : (
                <><ShoppingBag className="size-4" /> Add to cart</>
            )}
        </Button>
    )
}