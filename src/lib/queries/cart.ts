import type { CartItem } from '@/types'
import { createClient } from '../supabase/client'

export async function getCartItems(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('cart_id', userId)

    if (error) throw new Error(error.message)
    return (data ?? []) as CartItem[]
}