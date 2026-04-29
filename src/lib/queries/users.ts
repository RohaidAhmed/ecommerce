import { createServerClient } from '@/lib/supabase/server'
import type { Profile, Wishlist } from '@/types'

export async function getProfile(userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) return null
    return data as Profile
}

export async function getWishlist(userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('wishlists')
        .select('*, product:products(*, category:categories(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) return []
    return (data ?? []) as Wishlist[]
}