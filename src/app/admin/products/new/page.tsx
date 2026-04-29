import type { Metadata } from 'next'
import { getCategories } from '@/lib/queries/categories'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
    const categories = await getCategories()
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-display text-2xl font-bold">New Product</h1>
                <p className="text-sm text-[var(--color-muted)] mt-0.5">Fill in the details below to add a new product.</p>
            </div>
            <ProductForm categories={categories} />
        </div>
    )
}