'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        await supabase.from('wishlists').delete().eq('id', existing.id)
    } else {
        await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
    }

    revalidatePath('/account/wishlist')
    revalidatePath(`/products`)
}

export async function removeFromWishlist(wishlistId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId)
        .eq('user_id', user.id)

    revalidatePath('/account/wishlist')
}