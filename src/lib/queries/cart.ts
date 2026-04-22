// lib/queries/cart.ts

import { createServerClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'

/** Full cart with product details for a user */
export async function getCart(userId: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('cart_items')
        .select(
            `
                id, cart_id, quantity, product_id, variant_id,
                product:products(id, name, slug, price, compare_at_price, images, inventory_count)
            `
        )
        .eq('cart_id', userId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('[getCart]', error.message)
        return []
    }

    return (data ?? []) as unknown as CartItem[]
}

/** Cart item count for nav badge */
export async function getCartCount(userId: string): Promise<number> {
    const supabase = await createServerClient()

    const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('cart_id', userId)

    return count ?? 0
}