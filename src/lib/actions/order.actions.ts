'use server'
import { createServerClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/validations/checkout.schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CartItem, Address } from '@/types'

export async function placeOrder(
    cartItems: CartItem[],
    shippingAddress: Address
) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    if (cartItems.length === 0) throw new Error('Cart is empty')

    const parsed = checkoutSchema.safeParse(shippingAddress)
    if (!parsed.success) throw new Error('Invalid shipping address')

    const subtotal = cartItems.reduce(
        (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
        0
    )
    const shipping = subtotal >= 50 ? 0 : 9.99
    const tax = subtotal * 0.08
    const totalAmount = subtotal + shipping + tax

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            status: 'pending',
            total_amount: totalAmount,
            shipping_address: parsed.data,
            payment_method: 'cod',
        })
        .select()
        .single()

    if (orderError || !order) throw new Error(orderError?.message ?? 'Failed to create order')

    // Insert order items
    const orderItems = cartItems.map((ci) => ({
        order_id: order.id,
        product_id: ci.product_id,
        quantity: ci.quantity,
        unit_price: ci.product!.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw new Error(itemsError.message)

    // Clear cart
    await supabase.from('cart_items').delete().eq('cart_id', user.id)

    revalidatePath('/account/orders')
    revalidatePath('/cart')

    redirect(`/checkout/success?order_id=${order.id}`)
}

export async function cancelOrder(orderId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id)
        .in('status', ['pending'])

    if (error) throw new Error(error.message)
    revalidatePath('/account/orders')
}