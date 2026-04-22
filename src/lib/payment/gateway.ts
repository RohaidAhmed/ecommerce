// lib/payment/gateway.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE PLACE TO SWITCH PAYMENT PROVIDERS
//
// Set PAYMENT_PROVIDER in your .env:
//   PAYMENT_PROVIDER=stripe      → Stripe (default)
//   PAYMENT_PROVIDER=paymob      → Paymob (Pakistan / Egypt)
//   PAYMENT_PROVIDER=jazzcash    → JazzCash (Pakistan)
//
// Adding a new provider:
//   1. Create lib/payment/providers/myprovider.ts implementing PaymentGateway
//   2. Import it here and add a case below
//   3. Set PAYMENT_PROVIDER=myprovider in .env
// ─────────────────────────────────────────────────────────────────────────────

import type { PaymentGateway } from './types'

let _gateway: PaymentGateway | null = null

export function getPaymentGateway(): PaymentGateway {
    if (_gateway) return _gateway

    const provider = process.env.PAYMENT_PROVIDER ?? 'stripe'

    switch (provider) {
        case 'stripe': {
            const { stripeAdapter } = require('./providers/stripe')
            _gateway = stripeAdapter
            break
        }
        case 'paymob': {
            const { paymobAdapter } = require('./providers/paymob')
            _gateway = paymobAdapter
            break
        }
        case 'jazzcash': {
            const { jazzcashAdapter } = require('./providers/jazzcash')
            _gateway = jazzcashAdapter
            break
        }
        default:
            throw new Error(
                `Unknown PAYMENT_PROVIDER "${provider}". ` +
                `Supported: stripe | paymob | jazzcash`
            )
    }

    return _gateway!
}

// Re-export types for convenience
export type {
    PaymentGateway,
    CreatePaymentInput,
    PaymentResult,
    RefundInput,
    RefundResult,
    WebhookEvent,
    PaymentStatus,
} from './types'