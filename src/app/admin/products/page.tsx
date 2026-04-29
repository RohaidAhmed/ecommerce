import type { Metadata } from 'next'
import Link from 'next/link'
import { adminGetAllProducts } from '@/lib/queries/admin'
import { AdminProductsTable } from '@/components/admin/AdminProductsTable'
import { Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Products — Admin' }

type Props = { searchParams: Promise<{ page?: string }> }

export default async function AdminProductsPage({ searchParams }: Props) {
    const { page: pageStr } = await searchParams
    const page = Number(pageStr) || 1
    const { products, count } = await adminGetAllProducts(page)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">Products</h1>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">{count} total products</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                    <Plus className="size-4" /> Add product
                </Link>
            </div>
            <AdminProductsTable products={products} />
        </div>
    )
}