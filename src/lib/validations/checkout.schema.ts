// lib/validations/checkout.schema.ts

import { z } from 'zod'

export const addressSchema = z.object({
    line1: z.string().min(5, 'Street address is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postal_code: z.string().min(4, 'Postal code is required'),
    country: z.string().length(2, 'Use 2-letter country code (e.g. US)'),
})

export const checkoutSchema = z.object({
    shipping_address: addressSchema,
    email: z.string().email('Valid email required'),
})

export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>