'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTransition } from 'react'
import { adminDeleteProduct } from '@/lib/actions/admin.actions'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types'
import { Pencil, Trash2 } from 'lucide-react'

interface AdminProductsTableProps { products: Product[] }

export function AdminProductsTable({ products }: AdminProductsTableProps) {
    const [isPending, startTransition] = useTransition()

    function handleDelete(id: string, name: string) {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
        startTransition(() => adminDeleteProduct(id))
    }

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                        <tr>
                            {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative size-10 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-2)]">
                                            {product.images?.[0] ? (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-base opacity-30">📦</div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate max-w-[180px]">{product.name}</p>
                                            <p className="text-xs text-[var(--color-muted)] font-mono">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[var(--color-muted-fg)]">
                                    {product.category?.name ?? '—'}
                                </td>
                                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                                    {formatPrice(product.price)}
                                    {product.compare_at_price && (
                                        <span className="ml-1 text-xs text-[var(--color-muted)] line-through">
                                            {formatPrice(product.compare_at_price)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        'text-xs font-medium',
                                        product.inventory_count === 0 ? 'text-[var(--color-error)]' :
                                            product.inventory_count < 5 ? 'text-yellow-600' :
                                                'text-[var(--color-success)]'
                                    )}>
                                        {product.inventory_count}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        product.is_published
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-[var(--color-surface-2)] text-[var(--color-muted)]'
                                    )}>
                                        {product.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-border)] transition-colors text-[var(--color-muted-fg)]"
                                            aria-label="Edit"
                                        >
                                            <Pencil className="size-3.5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            disabled={isPending}
                                            className="p-1.5 rounded-[var(--radius-sm)] hover:bg-red-50 transition-colors text-[var(--color-muted)] hover:text-[var(--color-error)] disabled:opacity-50"
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}