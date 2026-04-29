import { createServerClient } from '@/lib/supabase/server'
import type { Order } from '@/types'

export async function getUserOrders(userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data ?? []) as Order[]
}

export async function getOrderById(id: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*))')
        .eq('id', id)
        .single()

    if (error) return null
    return data as Order
}