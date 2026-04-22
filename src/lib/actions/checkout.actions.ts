'use server'

// lib/actions/checkout.actions.ts

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/utils/auth'
import { getCart } from '@/lib/queries/cart'
import { getPaymentGateway } from '@/lib/payment/gateway'
import { checkoutSchema } from '@/lib/validations/checkout.schema'
import type { ActionResult } from '@/types'

export async function createOrderAction(formData: FormData): Promise<ActionResult<{ orderId: string; redirect?: string }>> {
    const user = await requireUser()
    const supabase = await createServerClient()

    // Validate address fields
    const raw = {
        email: formData.get('email'),
        shipping_address: {
            line1: formData.get('line1'),
            line2: formData.get('line2') || undefined,
            city: formData.get('city'),
            state: formData.get('state'),
            postal_code: formData.get('postal_code'),
            country: formData.get('country'),
        },
    }

    const parsed = checkoutSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors as any }
    }

    // Load cart
    const items = await getCart(user.id)
    if (!items.length) return { success: false, error: 'Your cart is empty' }

    // Calculate total (cents / paisa)
    const totalDecimal = items.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
    )
    const currency = process.env.PAYMENT_CURRENCY ?? 'USD'
    // For PKR: multiply by 100 (paisa), USD: cents — both are smallest unit
    const amountSmallest = Math.round(totalDecimal * 100)

    // Create order row (status: pending until webhook confirms)
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            status: 'pending',
            total_amount: totalDecimal,
            shipping_address: parsed.data.shipping_address,
        })
        .select('id')
        .single()

    if (orderError || !order) {
        return { success: false, error: 'Failed to create order. Please try again.' }
    }

    // Insert order items
    const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product?.price ?? 0,
    }))

    await supabase.from('order_items').insert(orderItems)

    // Initiate payment via abstract gateway
    const gateway = getPaymentGateway()
    let paymentResult

    try {
        paymentResult = await gateway.createPayment({
            amount: amountSmallest,
            currency,
            orderId: order.id,
            customerEmail: parsed.data.email,
            redirectUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/callback?orderId=${order.id}`,
        })
    } catch (err: any) {
        // Clean up pending order if payment initiation fails
        await supabase.from('orders').delete().eq('id', order.id)
        return { success: false, error: err.message ?? 'Payment initiation failed' }
    }

    // Save provider payment id on order
    await supabase
        .from('orders')
        .update({ stripe_payment_intent_id: paymentResult.providerPaymentId })
        .eq('id', order.id)

    // Redirect-based gateway (Paymob, JazzCash)
    if (paymentResult.redirectUrl) {
        redirect(paymentResult.redirectUrl)
    }

    // Client-secret based gateway (Stripe) — return to client for Elements
    return {
        success: true,
        data: {
            orderId: order.id,
            redirect: paymentResult.clientSecret
                ? `/checkout/payment?orderId=${order.id}&clientSecret=${paymentResult.clientSecret}`
                : `/checkout/confirm?orderId=${order.id}`,
        },
    }
}

/** Called from webhook — mark order paid and decrement stock */
export async function markOrderPaidAction(
    orderId: string,
    providerPaymentId: string
): Promise<void> {
    const supabase = await createServerClient()

    await supabase
        .from('orders')
        .update({
            status: 'processing',
            stripe_payment_intent_id: providerPaymentId,
        })
        .eq('id', orderId)

    // Decrement inventory
    const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId)

    for (const item of orderItems ?? []) {
        await supabase.rpc('decrement_inventory', {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
        })
    }

    // Clear the user's cart — find user_id from order
    const { data: order } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', orderId)
        .single()

    if (order) {
        await supabase.from('cart_items').delete().eq('cart_id', order.user_id)
    }
}