// Cash on Delivery adapter
// No payment processing — order is placed immediately, paid on delivery

import type {
    PaymentGateway, CreatePaymentInput, PaymentResult,
    RefundInput, RefundResult, WebhookVerifyInput, WebhookEvent, PaymentStatus,
} from '../types'

export const codAdapter: PaymentGateway = {
    name: 'cod',

    async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
        return {
            providerPaymentId: `COD-${input.orderId}`,
            status: 'cod_pending',
        }
    },

    async verifyWebhook(_input: WebhookVerifyInput): Promise<WebhookEvent> {
        throw new Error('COD does not use webhooks')
    },

    async refund(_input: RefundInput): Promise<RefundResult> {
        // COD refunds are handled manually (cash back on return)
        return { providerRefundId: 'cod-manual-refund', status: 'pending' }
    },

    async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
        return 'cod_pending'
    },
}