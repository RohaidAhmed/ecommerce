'use server'

// lib/actions/admin.actions.ts

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/utils/auth'
import { productSchema } from '@/lib/validations/product.schema'
import { slugify } from '@/lib/utils'
import type { ActionResult } from '@/types'

// ── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function createProductAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
    await requireAdmin()

    const raw = {
        name: formData.get('name'),
        slug: formData.get('slug') || slugify(String(formData.get('name') ?? '')),
        description: formData.get('description'),
        price: formData.get('price'),
        compare_at_price: formData.get('compare_at_price') || null,
        category_id: formData.get('category_id'),
        inventory_count: formData.get('inventory_count'),
        is_published: formData.get('is_published') === 'true',
        images: formData.getAll('images').filter(Boolean) as string[],
    }

    const parsed = productSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors as any }
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('products')
        .insert(parsed.data)
        .select('id')
        .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true, data: { id: data.id } }
}

export async function updateProductAction(
    id: string,
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin()

    const raw = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        price: formData.get('price'),
        compare_at_price: formData.get('compare_at_price') || null,
        category_id: formData.get('category_id'),
        inventory_count: formData.get('inventory_count'),
        is_published: formData.get('is_published') === 'true',
        images: formData.getAll('images').filter(Boolean) as string[],
    }

    const parsed = productSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors as any }
    }

    const supabase = await createServerClient()
    const { error } = await supabase.from('products').update(parsed.data).eq('id', id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${parsed.data.slug}`)
    return { success: true }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
    await requireAdmin()
    const supabase = await createServerClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
}

export async function togglePublishAction(id: string, current: boolean): Promise<ActionResult> {
    await requireAdmin()
    const supabase = await createServerClient()
    const { error } = await supabase
        .from('products')
        .update({ is_published: !current })
        .eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
}

// ── ORDERS ────────────────────────────────────────────────────────────────────

export async function updateOrderStatusAction(
    orderId: string,
    status: string
): Promise<ActionResult> {
    await requireAdmin()
    const supabase = await createServerClient()
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
    await requireAdmin()
    const name = String(formData.get('name') ?? '').trim()
    const parent_id = formData.get('parent_id') || null

    if (!name) return { success: false, error: 'Name is required' }

    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').insert({
        name,
        slug: slugify(name),
        parent_id,
    })

    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
    await requireAdmin()
    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/categories')
    return { success: true }
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────────────────────

export async function uploadProductImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
    await requireAdmin()

    const file = formData.get('file') as File
    if (!file) return { success: false, error: 'No file provided' }

    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = await createAdminClient()
    const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { contentType: file.type })

    if (error) return { success: false, error: error.message }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return { success: true, data: { url: data.publicUrl } }
}