'use client'

// components/admin/ProductForm.tsx

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { uploadProductImageAction } from '@/lib/actions/admin.actions'
import type { ActionResult } from '@/types'
import type { Category } from '@/types'

type Props = {
    action: (formData: FormData) => Promise<ActionResult<any>>
    defaultValues?: Record<string, any>
    categories: Category[]
    submitLabel?: string
}

const initial: ActionResult = { success: false, error: '' }

export function ProductForm({ action, defaultValues = {}, categories, submitLabel = 'Save Product' }: Props) {
    const router = useRouter()
    const [state, formAction] = useActionState(action, initial)
    const [images, setImages] = useState<string[]>(defaultValues.images ?? [])
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (state.success) router.push('/admin/products')
    }, [state, router])

    const addImageUrl = () => {
        if (imageUrl.trim()) {
            setImages((prev) => [...prev, imageUrl.trim()])
            setImageUrl('')
        }
    }

    const removeImage = (i: number) =>
        setImages((prev) => prev.filter((_, idx) => idx !== i))

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const fd = new FormData()
        fd.append('file', file)
        const result = await uploadProductImageAction(fd)
        if (result.success && result.data?.url) {
            setImages((prev) => [...prev, result.data!.url])
        }
        setUploading(false)
    }

    const fieldErrors =
        !state.success && typeof state.error === 'object' ? state.error : {}
    const globalError =
        !state.success && typeof state.error === 'string' && state.error ? state.error : null

    return (
        <form action={formAction} className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* Left column — main fields */}
            <div className="flex flex-col gap-6">

                {globalError && (
                    <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
                        <p className="text-sm text-[#dc2626]">{globalError}</p>
                    </div>
                )}

                {/* Basic info */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex flex-col gap-5">
                    <h2 className="font-semibold">Basic Information</h2>
                    <FormField
                        label="Product name"
                        name="name"
                        required
                        defaultValue={defaultValues.name}
                        error={fieldErrors.name}
                    />
                    <FormField
                        label="Slug (URL)"
                        name="slug"
                        placeholder="auto-generated-from-name"
                        defaultValue={defaultValues.slug}
                        error={fieldErrors.slug}
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-[#737373]">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={defaultValues.description}
                            className="w-full rounded-md border border-[#e5e5e5] bg-transparent px-3 py-2.5 text-sm text-[#0f0f0f] placeholder:text-[#d4d4d4] outline-none focus:border-[#0f0f0f] transition-colors resize-none"
                            placeholder="Describe this product…"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex flex-col gap-5">
                    <h2 className="font-semibold">Pricing</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <FormField
                            label="Price ($)"
                            name="price"
                            type="number"
                            placeholder="0.00"
                            defaultValue={defaultValues.price}
                            required
                            error={fieldErrors.price}
                        />
                        <FormField
                            label="Compare-at price ($)"
                            name="compare_at_price"
                            type="number"
                            placeholder="0.00 (optional)"
                            defaultValue={defaultValues.compare_at_price ?? ''}
                            error={fieldErrors.compare_at_price}
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex flex-col gap-4">
                    <h2 className="font-semibold">Images</h2>

                    {/* Hidden inputs for each image */}
                    {images.map((img, i) => (
                        <input key={i} type="hidden" name="images" value={img} />
                    ))}

                    {/* Image preview grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-[#f5f5f5] group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={11} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* URL input */}
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL…"
                            className="flex-1 h-9 rounded-md border border-[#e5e5e5] bg-white px-3 text-sm outline-none focus:border-[#0f0f0f] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={addImageUrl}
                            className="h-9 px-3 rounded-md border border-[#e5e5e5] text-sm text-[#737373] hover:border-[#0f0f0f] hover:text-[#0f0f0f] transition-colors flex items-center gap-1"
                        >
                            <Plus size={14} /> Add URL
                        </button>
                    </div>

                    {/* File upload */}
                    <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-dashed border-[#d4d4d4] text-sm text-[#737373] cursor-pointer hover:border-[#0f0f0f] hover:text-[#0f0f0f] transition-colors w-fit">
                        <Upload size={14} />
                        {uploading ? 'Uploading…' : 'Upload from device'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            {/* Right column — sidebar */}
            <div className="flex flex-col gap-6">

                {/* Publish */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 flex flex-col gap-4">
                    <h2 className="font-semibold">Status</h2>
                    <div className="flex flex-col gap-2">
                        {[
                            { value: 'true', label: 'Published', desc: 'Visible in the store' },
                            { value: 'false', label: 'Draft', desc: 'Hidden from customers' },
                        ].map((opt) => (
                            <label key={opt.value} className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-[#f5f5f5] transition-colors">
                                <input
                                    type="radio"
                                    name="is_published"
                                    value={opt.value}
                                    defaultChecked={
                                        opt.value === 'true'
                                            ? (defaultValues.is_published ?? false)
                                            : !(defaultValues.is_published ?? false)
                                    }
                                    className="mt-0.5"
                                />
                                <div>
                                    <p className="text-sm font-medium">{opt.label}</p>
                                    <p className="text-xs text-[#737373]">{opt.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <SubmitButton>{submitLabel}</SubmitButton>
                </div>

                {/* Category + Inventory */}
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 flex flex-col gap-5">
                    <h2 className="font-semibold">Organization</h2>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-[#737373]">
                            Category
                        </label>
                        <select
                            name="category_id"
                            defaultValue={defaultValues.category_id ?? ''}
                            required
                            className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2 text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] transition-colors"
                        >
                            <option value="" disabled>Select category…</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <FormField
                        label="Inventory count"
                        name="inventory_count"
                        type="number"
                        placeholder="0"
                        defaultValue={defaultValues.inventory_count ?? 0}
                        required
                        error={fieldErrors.inventory_count}
                    />
                </div>
            </div>
        </form>
    )
}