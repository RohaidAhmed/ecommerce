'use client'

// components/admin/AdminProductActions.tsx

import { useTransition } from 'react'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { togglePublishAction, deleteProductAction } from '@/lib/actions/admin.actions'

type Props = { id: string; isPublished: boolean }

export function AdminProductActions({ id, isPublished }: Props) {
    const [pending, startTransition] = useTransition()

    const handleToggle = () =>
        startTransition(() => togglePublishAction(id, isPublished))

    const handleDelete = () => {
        if (!confirm('Delete this product? This cannot be undone.')) return
        startTransition(() => deleteProductAction(id))
    }

    return (
        <>
            <button
                onClick={handleToggle}
                disabled={pending}
                aria-label={isPublished ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded-md text-[#737373] hover:text-[#0f0f0f] hover:bg-[#f5f5f5] transition-colors disabled:opacity-40"
                title={isPublished ? 'Unpublish' : 'Publish'}
            >
                {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
                onClick={handleDelete}
                disabled={pending}
                aria-label="Delete"
                className="p-1.5 rounded-md text-[#737373] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors disabled:opacity-40"
                title="Delete product"
            >
                <Trash2 size={14} />
            </button>
        </>
    )
}