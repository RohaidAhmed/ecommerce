// lib/queries/admin.ts

import { createServerClient } from '@/lib/supabase/server'
import type { Product, Category, Order, Profile } from '@/types'

export type AdminProductFilters = {
    category?: string      // slug
    isPublished?: boolean
    search?: string
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'inventory_asc' | 'inventory_desc'
    page?: number
    limit?: number
}

const DEFAULT_LIMIT = 20

/** Admin paginated product listing with filters */
export async function getAdminProducts(filters: AdminProductFilters = {}) {
    const supabase = await createServerClient()
    const {
        category,
        isPublished,
        search,
        sort = 'newest',
        page = 1,
        limit = DEFAULT_LIMIT,
    } = filters

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('products')
        .select(
            `
      id, name, slug, price, compare_at_price, images, inventory_count, is_published,
      category:categories(id, name, slug), created_at, updated_at
      `,
            { count: 'exact' }
        )
        .range(from, to)

    // Category filter — join through slug
    if (category) {
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .maybeSingle()

        if (cat) {
            query = query.eq('category_id', cat.id)
        }
    }

    // Published filter
    if (isPublished !== undefined) {
        query = query.eq('is_published', isPublished)
    }

    // Full-text search
    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    // Sorting
    switch (sort) {
        case 'price_asc':
            query = query.order('price', { ascending: true })
            break
        case 'price_desc':
            query = query.order('price', { ascending: false })
            break
        case 'name_asc':
            query = query.order('name', { ascending: true })
            break
        case 'inventory_asc':
            query = query.order('inventory_count', { ascending: true })
            break
        case 'inventory_desc':
            query = query.order('inventory_count', { ascending: false })
            break
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query

    if (error) {
        console.error('[getAdminProducts]', error.message)
        return { products: [], total: 0, pageCount: 0 }
    }

    return {
        products: (data ?? []) as unknown as Product[],
        total: count ?? 0,
        pageCount: Math.ceil((count ?? 0) / limit),
    }
}

/** Single product by ID for admin */
export async function getAdminProductById(id: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('products')
        .select(
            `
      *,
      category:categories(id, name, slug)
      `
        )
        .eq('id', id)
        .maybeSingle()

    if (error) console.error('[getAdminProductById]', error.message)
    return data as unknown as Product | null
}

/** All categories for admin */
export async function getAdminCategories(): Promise<Category[]> {
    const supabase = await createServerClient()

    const { data } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, created_at')
        .order('name')

    return (data ?? []) as Category[]
}

/** Admin orders with pagination and status filter */
export async function getAdminOrders({ page = 1, status }: { page?: number; status?: string } = {}) {
    const supabase = await createServerClient()
    const from = (page - 1) * DEFAULT_LIMIT
    const to = from + DEFAULT_LIMIT - 1

    let query = supabase
        .from('orders')
        .select(
            `
      id, status, total_amount, created_at, updated_at,
      shipping_address,
      user_id,
      profiles:profiles(id, full_name, avatar_url)
      `,
            { count: 'exact' }
        )
        .range(from, to)
        .order('created_at', { ascending: false })

    // Status filter
    if (status && status !== 'all') {
        query = query.eq('status', status)
    }

    const { data, count, error } = await query

    if (error) {
        console.error('[getAdminOrders]', error.message)
        return { orders: [], total: 0, pageCount: 0 }
    }

    return {
        orders: (data ?? []) as unknown as (Order & { profiles: Profile })[],
        total: count ?? 0,
        pageCount: Math.ceil((count ?? 0) / DEFAULT_LIMIT),
    }
}

/** Single order by ID for admin */
export async function getAdminOrderById(id: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
      *,
      profiles:profiles(id, full_name, avatar_url),
      order_items(
        id, quantity, unit_price,
        products(id, name, slug, images)
      )
      `
        )
        .eq('id', id)
        .maybeSingle()

    if (error) console.error('[getAdminOrderById]', error.message)

    const order = data as unknown as (Order & { profiles: Profile; order_items: any[] }) | null
    const items = order?.order_items ?? []

    return { order, items }
}

/** Admin customers (all for now, no pagination) */
export async function getAdminCustomers() {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[getAdminCustomers]', error.message)
        return []
    }

    return (data ?? []) as Profile[]
}

/** Single customer by ID for admin */
export async function getAdminCustomerById(id: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) console.error('[getAdminCustomerById]', error.message)
    return data as Profile | null
}

/** Dashboard stats for admin */
export async function getDashboardStats() {
    const supabase = await createServerClient()

    // Get counts in parallel
    const [productsRes, ordersRes, customersRes, revenueRes, recentOrdersRes, lowStockRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'delivered'),
        supabase.from('orders').select('id, status, total_amount, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, name, inventory_count').lt('inventory_count', 10).order('inventory_count', { ascending: true }).limit(5),
    ])

    const totalProducts = productsRes.count ?? 0
    const totalOrders = ordersRes.count ?? 0
    const totalCustomers = customersRes.count ?? 0
    const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + order.total_amount, 0) ?? 0
    const recentOrders = recentOrdersRes.data ?? []
    const lowStock = lowStockRes.data ?? []

    return {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        recentOrders,
        lowStock,
    }
}