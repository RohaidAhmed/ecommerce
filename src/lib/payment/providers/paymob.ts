// lib/payment/providers/paymob.ts
// Paymob adapter — redirect-based gateway popular in Pakistan/Egypt
// Docs: https://developers.paymob.com/pakistan/
//
// Required env vars:
//   PAYMOB_API_KEY
//   PAYMOB_INTEGRATION_ID     (card / mobile wallet integration)
//   PAYMOB_IFRAME_ID
//   PAYMOB_HMAC_SECRET
//
// Flow:
//   1. Authenticate → get auth token
//   2. Create order  → get order id
//   3. Create payment key → get payment key
//   4. Redirect user to iframe URL with payment key
//   5. Paymob POSTs callback to your webhook URL

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
import crypto from 'crypto'

const BASE = 'https://pakistan.paymob.com/api'

async function getAuthToken(): Promise<string> {
    const res = await fetch(`${BASE}/auth/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    })
    const data = await res.json()
    if (!data.token) throw new Error('Paymob auth failed')
    return data.token
}

export const paymobAdapter: PaymentGateway = {
    name: 'paymob',

    async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
        const token = await getAuthToken()

        // Step 2: Register order
        const orderRes = await fetch(`${BASE}/ecommerce/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_token: token,
                delivery_needed: false,
                amount_cents: input.amount,
                currency: input.currency,
                merchant_order_id: input.orderId,
                items: [],
            }),
        })
        const order = await orderRes.json()

        // Step 3: Payment key
        const pkRes = await fetch(`${BASE}/acceptance/payment_keys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_token: token,
                amount_cents: input.amount,
                expiration: 3600,
                order_id: order.id,
                currency: input.currency,
                integration_id: process.env.PAYMOB_INTEGRATION_ID,
                billing_data: {
                    email: input.customerEmail,
                    first_name: input.customerName?.split(' ')[0] ?? 'Customer',
                    last_name: input.customerName?.split(' ').slice(1).join(' ') || 'N/A',
                    phone_number: 'N/A',
                    apartment: 'N/A', floor: 'N/A', street: 'N/A',
                    building: 'N/A', shipping_method: 'N/A',
                    postal_code: 'N/A', city: 'N/A', country: 'N/A', state: 'N/A',
                },
            }),
        })
        const pk = await pkRes.json()

        const iframeId = process.env.PAYMOB_IFRAME_ID
        const redirectUrl = `https://pakistan.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${pk.token}`

        return {
            providerPaymentId: String(order.id),
            redirectUrl,
            status: 'pending',
        }
    },

    async verifyWebhook({ rawBody, signature, secret }: WebhookVerifyInput): Promise<WebhookEvent> {
        // Paymob sends HMAC in query param `hmac`
        // Concatenate specific fields in a fixed order and hash with HMAC_SECRET
        const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody
        const obj = body.obj ?? {}

        const fields = [
            obj.amount_cents, obj.created_at, obj.currency,
            obj.error_occured, obj.has_parent_transaction,
            obj.id, obj.integration_id, obj.is_3d_secure,
            obj.is_auth, obj.is_capture, obj.is_refunded,
            obj.is_standalone_payment, obj.is_voided,
            obj.order?.id, obj.owner,
            obj.pending, obj.source_data?.pan,
            obj.source_data?.sub_type, obj.source_data?.type,
            obj.success,
        ]

        const concatenated = fields.map(String).join('')
        const hash = crypto
            .createHmac('sha512', secret)
            .update(concatenated)
            .digest('hex')

        if (hash !== signature) throw new Error('Paymob webhook HMAC verification failed')

        const success = obj.success === true || obj.success === 'true'

        return {
            type: success ? 'payment.succeeded' : 'payment.failed',
            providerPaymentId: String(obj.order?.id ?? ''),
            orderId: String(obj.order?.merchant_order_id ?? ''),
            amount: obj.amount_cents,
            currency: obj.currency,
            raw: body,
        }
    },

    async refund({ providerPaymentId, amount }: RefundInput): Promise<RefundResult> {
        const token = await getAuthToken()
        const res = await fetch(`${BASE}/acceptance/void_refund/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_token: token,
                transaction_id: providerPaymentId,
                amount_cents: amount,
            }),
        })
        const data = await res.json()
        return {
            providerRefundId: String(data.id ?? ''),
            status: data.success ? 'succeeded' : 'failed',
        }
    },

    async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
        const token = await getAuthToken()
        const res = await fetch(`${BASE}/acceptance/transactions/${providerPaymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) return 'succeeded'
        if (data.pending) return 'processing'
        return 'failed'
    },
}