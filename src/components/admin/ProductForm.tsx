'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { adminCreateProduct, adminUpdateProduct } from '@/lib/actions/admin.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Category, Product } from '@/types'

type State = { error?: Record<string, string[]>; success?: boolean } | null

interface ProductFormProps {
    product?: Product
    categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter()
    const action = product
        ? adminUpdateProduct.bind(null, product.id)
        : adminCreateProduct

    const [state, formAction, pending] = useActionState<State, FormData>(action as any, null)

    useEffect(() => {
        if (state?.success) router.push('/admin/products')
    }, [state, router])

    return (
        <form action={formAction} className="space-y-5">
            {state?.error?.root && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Product name"
                    name="name"
                    required
                    defaultValue={product?.name}
                    error={state?.error?.name?.[0]}
                />
                <Input
                    label="Slug"
                    name="slug"
                    required
                    placeholder="my-product"
                    defaultValue={product?.slug}
                    error={state?.error?.slug?.[0]}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--color-muted-fg)]">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={product?.description ?? ''}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-colors resize-none"
                    placeholder="Describe the product…"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Price (USD)"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={product?.price}
                    error={state?.error?.price?.[0]}
                />
                <Input
                    label="Compare at price (optional)"
                    name="compare_at_price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product?.compare_at_price ?? ''}
                    error={state?.error?.compare_at_price?.[0]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--color-muted-fg)]">Category</label>
                    <select
                        name="category_id"
                        defaultValue={product?.category_id ?? ''}
                        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                        <option value="">— No category —</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Inventory count"
                    name="inventory_count"
                    type="number"
                    min="0"
                    required
                    defaultValue={product?.inventory_count ?? 0}
                    error={state?.error?.inventory_count?.[0]}
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    value="true"
                    defaultChecked={product?.is_published ?? false}
                    className="size-4 rounded accent-[var(--color-primary)]"
                />
                <label htmlFor="is_published" className="text-sm font-medium">
                    Published (visible to customers)
                </label>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" loading={pending} size="md">
                    {product ? 'Save changes' : 'Create product'}
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}