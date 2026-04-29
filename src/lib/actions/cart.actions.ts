'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number = 1) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Ensure cart row exists (cart id = user id)
    await supabase.from('carts').upsert({ id: user.id }, { onConflict: 'id' })

    const { error } = await supabase.from('cart_items').upsert(
        { cart_id: user.id, product_id: productId, quantity },
        { onConflict: 'cart_id,product_id' }
    )
    if (error) throw new Error(error.message)
    revalidatePath('/cart')
}

export async function removeFromCart(cartItemId: string) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
    if (error) throw new Error(error.message)
    revalidatePath('/cart')
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
    if (quantity < 1) return removeFromCart(cartItemId)
    const supabase = await createServerClient()
    const { error } = await supabase
        .from('cart_items').update({ quantity }).eq('id', cartItemId)
    if (error) throw new Error(error.message)
    revalidatePath('/cart')
}

export async function clearCart(userId: string) {
    const supabase = await createServerClient()
    await supabase.from('cart_items').delete().eq('cart_id', userId)
    revalidatePath('/cart')
}