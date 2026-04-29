import { createServerClient } from '@/lib/supabase/server'
import type { Order, Product, Profile } from '@/types'

export async function adminGetAllOrders(page = 1, limit = 20) {
    const supabase = await createServerClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(name, price, images))', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { orders: (data ?? []) as Order[], count: count ?? 0 }
}

export async function adminGetOrderById(orderId: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(name, price, images))')
        .eq('id', orderId)
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, data: data as Order }
}

export async function adminGetAllProducts(page = 1, limit = 20) {
    const supabase = await createServerClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
        .from('products')
        .select('*, category:categories(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { products: (data ?? []) as Product[], count: count ?? 0 }
}

export async function adminGetAllUsers(page = 1, limit = 20) {
    const supabase = await createServerClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { users: (data ?? []) as Profile[], count: count ?? 0 }
}

export async function adminGetDashboardStats() {
    const supabase = await createServerClient()

    const [orders, products, users, revenue] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders')
            .select('total_amount')
            .not('status', 'eq', 'cancelled'),
    ])

    const totalRevenue = (revenue.data ?? []).reduce(
        (sum: number, o: any) => sum + Number(o.total_amount),
        0
    )

    return {
        totalOrders: orders.count ?? 0,
        totalProducts: products.count ?? 0,
        totalUsers: users.count ?? 0,
        totalRevenue,
    }
}

export async function admingetcustomerById(userId: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, data: data as Profile }
}

export async function adminGetCustomerByOrderId(orderId: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', orderId)
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    const userId = data?.user_id
    if (!userId) {
        return { success: false, error: 'User ID not found for this order' }
    }

    return await admingetcustomerById(userId)
}

export async function adminGetRevenueByDateRange(startDate: string, endDate: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('orders')
        .select('total_amount')
        .not('status', 'eq', 'cancelled')
        .gte('created_at', startDate)
        .lte('created_at', endDate)

    if (error) {
        return { success: false, error: error.message }
    }

    const totalRevenue = (data ?? []).reduce(
        (sum: number, o: any) => sum + Number(o.total_amount),
        0
    )

    return { success: true, data: totalRevenue }
}