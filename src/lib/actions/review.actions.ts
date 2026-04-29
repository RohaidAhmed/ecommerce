'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reviewSchema = z.object({
    product_id: z.string().uuid(),
    rating: z.coerce.number().int().min(1).max(5),
    body: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

export async function submitReview(_prevState: unknown, formData: FormData) {
    const parsed = reviewSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { root: ['You must be signed in to leave a review'] } }

    // Check if user purchased this product
    const { data: purchased } = await supabase
        .from('order_items')
        .select('id, order:orders!inner(user_id, status)')
        .eq('product_id', parsed.data.product_id)
        .eq('orders.user_id', user.id)
        .not('orders.status', 'eq', 'cancelled')
        .limit(1)
        .single()

    if (!purchased) {
        return { error: { root: ['You can only review products you have purchased'] } }
    }

    const { error } = await supabase.from('reviews').upsert(
        {
            product_id: parsed.data.product_id,
            user_id: user.id,
            rating: parsed.data.rating,
            body: parsed.data.body,
        },
        { onConflict: 'product_id,user_id' }
    )

    if (error) return { error: { root: [error.message] } }

    revalidatePath(`/products`)
    return { success: true }
}

export async function deleteReview(reviewId: string, productSlug: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id)

    revalidatePath(`/products/${productSlug}`)
}