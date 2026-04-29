import { z } from 'zod'

export const checkoutSchema = z.object({
    line1: z.string().min(5, 'Street address required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    postal_code: z.string().min(4, 'Postal code required'),
    country: z.string().length(2, 'Use 2-letter country code'),
})

// export const checkoutSchema = z.object({
//     email: z.string().email('Invalid email address'),
//     shipping_address: addressSchema,
// })

export type CheckoutInput = z.infer<typeof checkoutSchema>