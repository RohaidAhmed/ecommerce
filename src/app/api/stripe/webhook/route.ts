import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    return new Response('Not configured', { status: 501 })
    // const body = await request.text()
    // const sig = request.headers.get('stripe-signature')

    // if (!sig) return new Response('Missing signature', { status: 400 })

    // let event: Stripe.Event
    // try {
    //     event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    // } catch {
    //     return new Response('Invalid signature', { status: 400 })
    // }

    // const supabase = createAdminClient()

    // switch (event.type) {
    //     case 'checkout.session.completed': {
    //         const session = event.data.object as Stripe.Checkout.Session
    //         const userId = session.metadata?.user_id
    //         const address = session.metadata?.shipping_address
    //             ? JSON.parse(session.metadata.shipping_address)
    //             : null
    //         const totalAmount = (session.amount_total ?? 0) / 100

    //         if (!userId) break

    //         // Create order record
    //         const { data: order, error: orderError } = await supabase
    //             .from('orders')
    //             .insert({
    //                 user_id: userId,
    //                 status: 'processing',
    //                 total_amount: totalAmount,
    //                 stripe_payment_intent_id: session.payment_intent as string,
    //                 shipping_address: address,
    //             })
    //             .select()
    //             .single()

    //         if (orderError || !order) {
    //             console.error('Failed to create order:', orderError)
    //             break
    //         }

    //         // Move cart items → order items
    //         const { data: cartItems } = await supabase
    //             .from('cart_items')
    //             .select('*, product:products(*)')
    //             .eq('cart_id', userId)

    //         if (cartItems && cartItems.length > 0) {
    //             const orderItems = cartItems.map((ci: any) => ({
    //                 order_id: order.id,
    //                 product_id: ci.product_id,
    //                 quantity: ci.quantity,
    //                 unit_price: ci.product.price,
    //             }))

    //             await supabase.from('order_items').insert(orderItems)

    //             // Clear the cart
    //             await supabase.from('cart_items').delete().eq('cart_id', userId)
    //         }

    //         break
    //     }

    //     case 'payment_intent.payment_failed': {
    //         const pi = event.data.object as Stripe.PaymentIntent
    //         await supabase
    //             .from('orders')
    //             .update({ status: 'cancelled' })
    //             .eq('stripe_payment_intent_id', pi.id)
    //         break
    //     }
    // }

    // return new Response('OK', { status: 200 })
}