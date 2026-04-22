// lib/payment/providers/jazzcash.ts
// JazzCash adapter — Pakistan's most widely used mobile wallet gateway
// Docs: https://jazzcash.com.pk/developer-portal/
//
// Required env vars:
//   JAZZCASH_MERCHANT_ID
//   JAZZCASH_PASSWORD
//   JAZZCASH_INTEGRITY_SALT
//   JAZZCASH_RETURN_URL
//
// Flow: hash params → POST to JazzCash → redirect → callback to RETURN_URL

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

const JC_BASE = 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'

function buildHash(params: Record<string, string>, salt: string): string {
    const sorted = Object.keys(params)
        .sort()
        .map((k) => params[k])
        .join('&')
    return crypto
        .createHmac('sha256', salt)
        .update(`${salt}&${sorted}`)
        .digest('hex')
        .toUpperCase()
}

export const jazzcashAdapter: PaymentGateway = {
    name: 'jazzcash',

    async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
        const merchantId = process.env.JAZZCASH_MERCHANT_ID!
        const password = process.env.JAZZCASH_PASSWORD!
        const salt = process.env.JAZZCASH_INTEGRITY_SALT!
        const returnUrl = input.redirectUrl ?? process.env.JAZZCASH_RETURN_URL!

        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        const txnDateTime = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
        const expiry = `${now.getFullYear() + 1}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

        const params: Record<string, string> = {
            pp_Version: '1.1',
            pp_TxnType: 'MWALLET',
            pp_Language: 'EN',
            pp_MerchantID: merchantId,
            pp_Password: password,
            pp_TxnRefNo: `T${txnDateTime}`,
            pp_Amount: String(input.amount),
            pp_TxnCurrency: input.currency,
            pp_TxnDateTime: txnDateTime,
            pp_BillReference: input.orderId,
            pp_Description: `Order ${input.orderId}`,
            pp_TxnExpiryDateTime: expiry,
            pp_ReturnURL: returnUrl,
            pp_SecureHash: '',
        }

        params.pp_SecureHash = buildHash(params, salt)

        // Build redirect form URL (POST redirect — build a form server-side)
        const qs = new URLSearchParams(params).toString()
        const redirectUrl = `${JC_BASE}?${qs}`

        return {
            providerPaymentId: params.pp_TxnRefNo,
            redirectUrl,
            status: 'pending',
        }
    },

    async verifyWebhook({ rawBody, signature, secret }: WebhookVerifyInput): Promise<WebhookEvent> {
        const params = Object.fromEntries(new URLSearchParams(
            typeof rawBody === 'string' ? rawBody : rawBody.toString()
        ))

        const receivedHash = params.pp_SecureHash
        delete params.pp_SecureHash

        const expected = buildHash(params as Record<string, string>, secret)
        if (expected !== receivedHash) {
            throw new Error('JazzCash HMAC verification failed')
        }

        const success = params.pp_ResponseCode === '000'
        return {
            type: success ? 'payment.succeeded' : 'payment.failed',
            providerPaymentId: params.pp_TxnRefNo ?? '',
            orderId: params.pp_BillReference,
            amount: params.pp_Amount ? parseInt(params.pp_Amount) : undefined,
            currency: params.pp_TxnCurrency,
            raw: params,
        }
    },

    async refund(_input: RefundInput): Promise<RefundResult> {
        // JazzCash refunds are handled via merchant portal or their inquiry API
        // Implement when you receive merchant API refund credentials
        throw new Error('JazzCash refund API not yet implemented — use merchant portal')
    },

    async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
        // JazzCash transaction inquiry API
        const merchantId = process.env.JAZZCASH_MERCHANT_ID!
        const password = process.env.JAZZCASH_PASSWORD!
        const salt = process.env.JAZZCASH_INTEGRITY_SALT!

        const params = { pp_MerchantID: merchantId, pp_Password: password, pp_TxnRefNo: providerPaymentId }
        const hash = buildHash(params, salt)

        const res = await fetch('https://payments.jazzcash.com.pk/ApplicationAPI/API/2.0/inquiry/inquiryAPI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, pp_SecureHash: hash }),
        })
        const data = await res.json()
        if (data.pp_ResponseCode === '000') return 'succeeded'
        if (data.pp_ResponseCode === '157') return 'processing'
        return 'failed'
    },
}