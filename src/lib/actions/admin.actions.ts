'use server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/utils/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const productSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    compare_at_price: z.coerce.number().optional(),
    category_id: z.string().uuid().optional(),
    inventory_count: z.coerce.number().int().min(0),
    is_published: z.coerce.boolean().optional(),
})

export async function adminCreateProduct(_prevState: unknown, formData: FormData) {
    await requireAdmin()
    const parsed = productSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { error } = await supabase.from('products').insert({
        ...parsed.data,
        is_published: parsed.data.is_published ?? false,
        images: [],
    })

    if (error) return { error: { root: [error.message] } }
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
}

export async function adminUpdateProduct(id: string, _prevState: unknown, formData: FormData) {
    await requireAdmin()
    const parsed = productSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { error } = await supabase.from('products').update(parsed.data).eq('id', id)

    if (error) return { error: { root: [error.message] } }
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
}

export async function adminDeleteProduct(id: string) {
    await requireAdmin()
    const supabase = await createServerClient()
    await supabase.from('products').delete().eq('id', id)
    revalidatePath('/admin/products')
    revalidatePath('/products')
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
    await requireAdmin()
    const supabase = await createServerClient()
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/orders')
}

export async function adminToggleUserRole(userId: string, currentRole: string) {
    await requireAdmin()
    const supabase = await createServerClient()
    const newRole = currentRole === 'admin' ? 'customer' : 'admin'
    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/admin/users')
}