import { createServerClient } from '@/lib/supabase/server'
import type { Product, SortOption } from '@/types'

type GetProductsParams = {
    category?: string
    search?: string
    sort?: SortOption
    page?: number
    limit?: number
    min_price?: number
    max_price?: number
}

export async function getProducts({
    category,
    search,
    sort = 'newest',
    page = 1,
    limit = 12,
    min_price,
    max_price,
}: GetProductsParams = {}) {
    const supabase = await createServerClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('products')
        .select('*, category:categories(*)', { count: 'exact' })
        .eq('is_published', true)
        .range(from, to)

    if (category) query = query.eq('categories.slug', category)
    if (search) query = query.ilike('name', `%${search}%`)
    if (min_price) query = query.gte('price', min_price)
    if (max_price) query = query.lte('price', max_price)

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    if (sort === 'price_desc') query = query.order('price', { ascending: false })
    if (sort === 'newest') query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return { products: (data ?? []) as Product[], count: count ?? 0 }
}

// export async function getProductBySlug(slug: string) {
//     const supabase = await createServerClient()
//     const { data, error } = await supabase
//         .from('products')
//         .select('*, category:categories(*), reviews(*, profile:profiles(*))')
//         .eq('slug', slug)
//         .eq('is_published', true)
//         .maybeSingle()

//     if (error) return null
//     return data as Product
// }

export async function getProductBySlug(slug: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('products')
        .select(`
                    *,
                    category:categories(id, name, slug),
                    reviews(id, rating, body, created_at, user_id)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()

    if (error) console.error('[getProductBySlug]', error.message)
    return data as unknown as (Product & { reviews: any[] }) | null
}

export async function getFeaturedProducts(limit = 8) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message)
    return (data ?? []) as Product[]
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_published', true)
        .eq('category_id', categoryId)
        .neq('id', excludeId)
        .limit(limit)

    if (error) return []
    return (data ?? []) as Product[]
}