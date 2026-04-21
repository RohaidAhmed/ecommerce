// lib/validations/product.schema.ts

import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
    description: z.string().optional(),
    price: z.coerce.number().positive('Price must be positive'),
    compare_at_price: z.coerce.number().positive().nullable().optional(),
    category_id: z.string().uuid('Invalid category'),
    inventory_count: z.coerce.number().int().min(0).default(0),
    is_published: z.boolean().default(false),
    images: z.array(z.string().url()).default([]),
})

export type ProductInput = z.infer<typeof productSchema>