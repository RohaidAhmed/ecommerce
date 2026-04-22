// lib/payment/providers/stripe.ts
// Stripe adapter — implements PaymentGateway
// Docs: https://stripe.com/docs/api

import type {
    PaymentGateway,
    CreatePaymentInput,
    PaymentResult,
    RefundInput,
    RefundResult,
    WebhookVerifyInput,
    WebhookEvent,
    PaymentStatus,
} from '../types'

function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    // Dynamic import so the module isn't bundled client-side
    const Stripe = require('stripe')
    return new Stripe(key, { apiVersion: '2025-03-31.basil' })
}

function normaliseStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
        case 'succeeded': return 'succeeded'
        case 'processing': return 'processing'
        case 'requires_action':
        case 'requires_confirmation':
        case 'requires_payment_method': return 'requires_action'
        case 'canceled': return 'cancelled'
        default: return 'pending'
    }
}

export const stripeAdapter: PaymentGateway = {
    name: 'stripe',

    async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
        const stripe = getStripe()
        const intent = await stripe.paymentIntents.create({
            amount: input.amount,
            currency: input.currency.toLowerCase(),
            receipt_email: input.customerEmail,
            metadata: {
                orderId: input.orderId,
                ...input.metadata,
            },
        })

        return {
            providerPaymentId: intent.id,
            clientSecret: intent.client_secret,
            status: normaliseStatus(intent.status),
        }
    },

    async verifyWebhook({ rawBody, signature, secret }: WebhookVerifyInput): Promise<WebhookEvent> {
        const stripe = getStripe()
        let event: any

        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, secret)
        } catch {
            throw new Error('Stripe webhook signature verification failed')
        }

        const intent = event.data?.object
        let type: string

        switch (event.type) {
            case 'payment_intent.succeeded': type = 'payment.succeeded'; break
            case 'payment_intent.payment_failed': type = 'payment.failed'; break
            case 'charge.refunded': type = 'refund.created'; break
            default: type = event.type
        }

        return {
            type,
            providerPaymentId: intent?.id ?? '',
            orderId: intent?.metadata?.orderId,
            amount: intent?.amount,
            currency: intent?.currency?.toUpperCase(),
            raw: event,
        }
    },

    async refund({ providerPaymentId, amount, reason }: RefundInput): Promise<RefundResult> {
        const stripe = getStripe()
        const refund = await stripe.refunds.create({
            payment_intent: providerPaymentId,
            ...(amount ? { amount } : {}),
            ...(reason ? { reason: 'requested_by_customer' } : {}),
        })

        return {
            providerRefundId: refund.id,
            status: refund.status === 'succeeded' ? 'succeeded' : 'pending',
        }
    },

    async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
        const stripe = getStripe()
        const intent = await stripe.paymentIntents.retrieve(providerPaymentId)
        return normaliseStatus(intent.status)
    },
}