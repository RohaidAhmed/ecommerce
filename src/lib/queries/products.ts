// lib/queries/products.ts

import { createServerClient } from '@/lib/supabase/server'
import type { Product, Category } from '@/types'

export type ProductFilters = {
    category?: string      // slug
    minPrice?: number
    maxPrice?: number
    search?: string
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc'
    page?: number
    limit?: number
}

const DEFAULT_LIMIT = 12

/** Paginated product listing with filters */
export async function getProducts(filters: ProductFilters = {}) {
    const supabase = await createServerClient()
    const {
        category,
        minPrice,
        maxPrice,
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
      id, name, slug, price, compare_at_price, images, inventory_count,
      category:categories(id, name, slug)
      `,
            { count: 'exact' }
        )
        .eq('is_published', true)
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

    // Price range
    if (minPrice != null) query = query.gte('price', minPrice)
    if (maxPrice != null) query = query.lte('price', maxPrice)

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
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query

    if (error) {
        console.error('[getProducts]', error.message)
        return { products: [], total: 0, pageCount: 0 }
    }

    return {
        products: (data ?? []) as unknown as Product[],
        total: count ?? 0,
        pageCount: Math.ceil((count ?? 0) / limit),
    }
}

/** Single product by slug (with ratings joined) */
export async function getProductBySlug(slug: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('products')
        .select(
            `
      *,
      category:categories(id, name, slug),
      reviews(id, rating, body, created_at, user_id)
      `
        )
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()

    if (error) console.error('[getProductBySlug]', error.message)
    return data as unknown as (Product & { reviews: any[] }) | null
}

/** Related products — same category, exclude current */
export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
    const supabase = await createServerClient()

    const { data } = await supabase
        .from('products')
        .select('id, name, slug, price, compare_at_price, images')
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .neq('id', excludeId)
        .limit(limit)

    return (data ?? []) as unknown as Product[]
}

/** All top-level categories */
export async function getCategories(): Promise<Category[]> {
    const supabase = await createServerClient()

    const { data } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .is('parent_id', null)
        .order('name')

    return (data ?? []) as Category[]
}

/** Category by slug */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const supabase = await createServerClient()

    const { data } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .eq('slug', slug)
        .maybeSingle()

    return data as Category | null
}

/** Price range bounds for filter UI */
export async function getPriceRange() {
    const supabase = await createServerClient()

    const { data } = await supabase
        .from('products')
        .select('price')
        .eq('is_published', true)
        .order('price', { ascending: true })

    if (!data?.length) return { min: 0, max: 500 }

    return {
        min: Math.floor(data[0].price),
        max: Math.ceil(data[data.length - 1].price),
    }
}