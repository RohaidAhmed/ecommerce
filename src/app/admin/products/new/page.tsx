// app/admin/products/new/page.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/lib/queries/products'
import { createProductAction } from '@/lib/actions/admin.actions'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
    const categories = await getCategories()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
            </div>

            <ProductForm
                action={createProductAction}
                categories={categories}
                submitLabel="Create Product"
            />
        </div>
    )
}