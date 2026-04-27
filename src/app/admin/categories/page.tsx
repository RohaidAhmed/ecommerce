// app/admin/categories/page.tsx

import { Trash2 } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { createCategoryAction, deleteCategoryAction } from '@/lib/actions/admin.actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { FormField } from '@/components/ui/FormField'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
    const supabase = await createServerClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .order('name')

    const top = (categories ?? []).filter((c) => !c.parent_id)
    const subs = (categories ?? []).filter((c) => c.parent_id)

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>

            {/* Add category */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 flex flex-col gap-5">
                <h2 className="font-semibold">Add Category</h2>
                <form action={createCategoryAction} className="flex flex-col gap-4">
                    <FormField label="Name" name="name" required placeholder="e.g. Men" />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-[#737373]">
                            Parent (optional)
                        </label>
                        <select
                            name="parent_id"
                            className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2 text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] transition-colors"
                        >
                            <option value="">— Top-level category —</option>
                            {top.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <SubmitButton className="max-w-[160px]">Add Category</SubmitButton>
                </form>
            </div>

            {/* Category list */}
            <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#e5e5e5]">
                    <h2 className="font-semibold">All Categories</h2>
                </div>
                <div className="divide-y divide-[#f5f5f5]">
                    {top.map((cat) => (
                        <div key={cat.id}>
                            {/* Top-level */}
                            <div className="flex items-center justify-between px-5 py-3 hover:bg-[#fafafa] transition-colors">
                                <div>
                                    <p className="text-sm font-semibold">{cat.name}</p>
                                    <p className="text-xs text-[#737373] font-mono">/{cat.slug}</p>
                                </div>
                                <form action={deleteCategoryAction.bind(null, cat.id)}>
                                    <button
                                        type="submit"
                                        className="p-1.5 rounded-md text-[#737373] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </form>
                            </div>

                            {/* Sub-categories */}
                            {subs
                                .filter((s) => s.parent_id === cat.id)
                                .map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between pl-10 pr-5 py-2.5 hover:bg-[#fafafa] transition-colors border-t border-[#f5f5f5]">
                                        <div>
                                            <p className="text-sm text-[#737373]">{sub.name}</p>
                                            <p className="text-xs text-[#d4d4d4] font-mono">/{sub.slug}</p>
                                        </div>
                                        <form action={deleteCategoryAction.bind(null, sub.id)}>
                                            <button
                                                type="submit"
                                                className="p-1.5 rounded-md text-[#737373] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </form>
                                    </div>
                                ))}
                        </div>
                    ))}

                    {!top.length && (
                        <p className="px-5 py-8 text-sm text-[#737373] text-center">No categories yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}