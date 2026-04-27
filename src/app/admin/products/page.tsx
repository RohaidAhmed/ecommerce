// app/admin/products/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { getAdminProducts } from '@/lib/queries/admin'
import { formatPrice, cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/Pagination'
import { AdminProductActions } from '@/components/admin/AdminProductActions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products — Admin' }

type Props = { searchParams: Promise<{ page?: string; search?: string }> }

export default async function AdminProductsPage({ searchParams }: Props) {
    const sp = await searchParams
    const page = Math.max(1, parseInt(sp.page ?? '1', 10))

    const { products, total, pageCount } = await getAdminProducts({
        page,
        search: sp.search,
    })

    function buildHref(p: number) {
        const params = new URLSearchParams()
        if (sp.search) params.set('search', sp.search)
        if (p > 1) params.set('page', String(p))
        const qs = params.toString()
        return `/admin/products${qs ? `?${qs}` : ''}`
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-[#737373] mt-0.5">{total} total</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 h-9 px-4 bg-[#0f0f0f] text-white rounded-md text-sm font-semibold hover:bg-[#262626] transition-colors"
                >
                    <Plus size={15} /> Add Product
                </Link>
            </div>

            {/* Search */}
            <form className="flex gap-2">
                <input
                    name="search"
                    type="search"
                    defaultValue={sp.search}
                    placeholder="Search products…"
                    className="h-9 flex-1 max-w-sm rounded-md border border-[#e5e5e5] bg-white px-3 text-sm outline-none focus:border-[#0f0f0f] transition-colors"
                />
                <button
                    type="submit"
                    className="h-9 px-4 bg-[#0f0f0f] text-white rounded-md text-sm font-semibold hover:bg-[#262626] transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Product</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Price</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider hidden md:table-cell">Stock</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f5f5]">
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#737373]">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-[#fafafa] transition-colors">
                                    {/* Product */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#f5f5f5] shrink-0">
                                                {product.images?.[0] && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium line-clamp-1 max-w-[200px]">{product.name}</p>
                                                <p className="text-xs text-[#737373] font-mono">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3 text-[#737373] hidden sm:table-cell">
                                        {product.category?.name ?? '—'}
                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-3 font-semibold">
                                        {formatPrice(product.price)}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className={cn(
                                            'text-xs font-semibold px-2 py-0.5 rounded-full',
                                            product.inventory_count === 0
                                                ? 'bg-[#fee2e2] text-[#dc2626]'
                                                : product.inventory_count < 10
                                                    ? 'bg-[#fef9c3] text-[#854d0e]'
                                                    : 'bg-[#dcfce7] text-[#166534]'
                                        )}>
                                            {product.inventory_count === 0 ? 'Out of stock' : `${product.inventory_count} units`}
                                        </span>
                                    </td>

                                    {/* Published */}
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                                            product.is_published
                                                ? 'bg-[#dcfce7] text-[#166534]'
                                                : 'bg-[#f5f5f5] text-[#737373]'
                                        )}>
                                            {product.is_published
                                                ? <><Eye size={10} /> Live</>
                                                : <><EyeOff size={10} /> Draft</>
                                            }
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <AdminProductActions
                                                id={product.id}
                                                isPublished={product.is_published}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination page={page} pageCount={pageCount} buildHref={buildHref} />
        </div>
    )
}