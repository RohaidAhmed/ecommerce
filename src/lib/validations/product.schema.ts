import { z } from 'zod'

export const productFilterSchema = z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest']).optional(),
    page: z.coerce.number().min(1).optional(),
    min_price: z.coerce.number().min(0).optional(),
    max_price: z.coerce.number().min(0).optional(),
})

export type ProductFilterInput = z.infer<typeof productFilterSchema>