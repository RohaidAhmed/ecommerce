// app/api/payment/webhook/route.ts
// Works with any gateway — Stripe, Paymob, JazzCash, etc.
// Set PAYMENT_PROVIDER in .env to switch between them.

import { NextResponse } from 'next/server'
import { getPaymentGateway } from '@/lib/payment/gateway'
import { markOrderPaidAction } from '@/lib/actions/checkout.actions'

export async function POST(request: Request) {
    const rawBody = await request.text()

    // Stripe sends signature in header; Paymob/JazzCash in query or body
    const signature =
        request.headers.get('stripe-signature') ??
        request.headers.get('x-paymob-signature') ??
        new URL(request.url).searchParams.get('hmac') ??
        ''

    const secret = process.env.PAYMENT_WEBHOOK_SECRET ?? ''
    const gateway = getPaymentGateway()

    let event
    try {
        event = await gateway.verifyWebhook({ rawBody, signature, secret })
    } catch (err: any) {
        console.error(`[webhook] Verification failed (${gateway.name}):`, err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`[webhook] ${gateway.name} event: ${event.type}`)

    switch (event.type) {
        case 'payment.succeeded':
            if (event.orderId) {
                await markOrderPaidAction(event.orderId, event.providerPaymentId)
            }
            break

        case 'payment.failed':
            // Optionally update order status to cancelled
            console.warn(`[webhook] Payment failed for order ${event.orderId}`)
            break

        case 'refund.created':
            console.log(`[webhook] Refund created for payment ${event.providerPaymentId}`)
            break

        default:
            console.log(`[webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}

// Required for Stripe signature verification (raw body needed)
export const config = { api: { bodyParser: false } }