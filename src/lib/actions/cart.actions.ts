'use server'

// lib/actions/cart.actions.ts

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/utils/auth'
import type { ActionResult } from '@/types'

/** Ensure cart row exists for user (cart id = user id) */
async function ensureCart(userId: string) {
    const supabase = await createServerClient()
    await supabase.from('carts').upsert({ id: userId }, { onConflict: 'id' })
}

export async function addToCartAction(
    productId: string,
    quantity = 1
): Promise<ActionResult> {
    const user = await requireUser()
    await ensureCart(user.id)

    const supabase = await createServerClient()

    // Check inventory
    const { data: product } = await supabase
        .from('products')
        .select('inventory_count, name')
        .eq('id', productId)
        .single()

    if (!product) return { success: false, error: 'Product not found' }
    if (product.inventory_count < quantity)
        return { success: false, error: `Only ${product.inventory_count} in stock` }

    // Upsert — increment if already in cart
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > product.inventory_count)
            return { success: false, error: `Only ${product.inventory_count} in stock` }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', existing.id)

        if (error) return { success: false, error: error.message }
    } else {
        const { error } = await supabase
            .from('cart_items')
            .insert({ cart_id: user.id, product_id: productId, quantity })

        if (error) return { success: false, error: error.message }
    }

    revalidatePath('/cart')
    revalidatePath('/', 'layout') // refresh cart count in navbar
    return { success: true }
}

export async function updateCartItemAction(
    itemId: string,
    quantity: number
): Promise<ActionResult> {
    const user = await requireUser()
    const supabase = await createServerClient()

    if (quantity < 1) {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
            .eq('cart_id', user.id)

        if (error) return { success: false, error: error.message }
    } else {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId)
            .eq('cart_id', user.id)

        if (error) return { success: false, error: error.message }
    }

    revalidatePath('/cart')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function removeCartItemAction(itemId: string): Promise<ActionResult> {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('cart_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/cart')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function clearCartAction(): Promise<ActionResult> {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/cart')
    revalidatePath('/', 'layout')
    return { success: true }
}