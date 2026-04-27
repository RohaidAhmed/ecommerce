// app/admin/products/[id]/edit/page.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/queries/products'
import { updateProductAction } from '@/lib/actions/admin.actions'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Product — Admin' }

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (!product) notFound()

    const categories = await getCategories()

    // Bind the product id to the action
    const updateAction = updateProductAction.bind(null, id)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-sm text-[#737373]">{product.name}</p>
                </div>
            </div>

            <ProductForm
                action={updateAction}
                defaultValues={product}
                categories={categories}
                submitLabel="Save Changes"
            />
        </div>
    )
}