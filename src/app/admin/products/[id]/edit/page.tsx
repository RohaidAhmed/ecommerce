import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/queries/categories'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types'

export const metadata: Metadata = { title: 'Edit Product — Admin' }

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
    const { id } = await params
    const supabase = await createServerClient()

    const [{ data: product }, categories] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').eq('id', id).single(),
        getCategories(),
    ])

    if (!product) notFound()

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-display text-2xl font-bold">Edit Product</h1>
                <p className="text-sm text-[var(--color-muted)] mt-0.5">{product.name}</p>
            </div>
            <ProductForm product={product as Product} categories={categories} />
        </div>
    )
}