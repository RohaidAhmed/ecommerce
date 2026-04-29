// lib/payment/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// All payment providers must implement the PaymentGateway interface.
// To swap providers: change PAYMENT_PROVIDER in .env and add a new adapter
// in lib/payment/providers/. Nothing else in the app needs to change.
// ─────────────────────────────────────────────────────────────────────────────

export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'AED' | string

export type PaymentStatus =
    | 'pending'
    | 'requires_action'   // 3DS / redirect needed
    | 'processing'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
    | 'refunded'
    | 'cod_pending'      // for Cash on Delivery orders awaiting delivery/payment

export type CreatePaymentInput = {
    amount: number           // in smallest currency unit (cents / paisa)
    currency: Currency
    orderId: string
    customerEmail: string
    customerName?: string
    metadata?: Record<string, string>
    redirectUrl?: string    // used by redirect-based gateways (Paymob, JazzCash)
}

export type PaymentResult = {
    providerPaymentId: string   // Stripe PaymentIntent id, Paymob order id, etc.
    clientSecret?: string       // for client-side confirmation (Stripe Elements)
    redirectUrl?: string        // for server-side redirect gateways
    status: PaymentStatus
}

export type RefundInput = {
    providerPaymentId: string
    amount?: number             // partial refund — omit for full refund
    reason?: string
}

export type RefundResult = {
    providerRefundId: string
    status: 'succeeded' | 'failed' | 'pending'
}

export type WebhookVerifyInput = {
    rawBody: string | Buffer
    signature: string
    secret: string
}

export type WebhookEvent = {
    type: string                // normalised: 'payment.succeeded' | 'payment.failed' | 'refund.created'
    providerPaymentId: string
    orderId?: string
    amount?: number
    currency?: Currency
    raw: unknown                // full provider payload for custom handling
}

/**
 * Every payment provider adapter must implement this interface.
 */
export interface PaymentGateway {
    name: string

    /** Create a payment intent / order on the provider side */
    createPayment(input: CreatePaymentInput): Promise<PaymentResult>

    /** Verify and parse an inbound webhook from the provider */
    verifyWebhook(input: WebhookVerifyInput): Promise<WebhookEvent>

    /** Issue a refund */
    refund(input: RefundInput): Promise<RefundResult>

    /** Check the current status of a payment (polling fallback) */
    getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus>
}