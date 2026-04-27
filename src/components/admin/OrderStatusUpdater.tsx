'use client'

// components/admin/OrderStatusUpdater.tsx

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/types'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

type Props = {
    orderId: string
    currentStatus: string
    action: (orderId: string, status: string) => Promise<ActionResult>
}

export function OrderStatusUpdater({ orderId, currentStatus, action }: Props) {
    const [selected, setSelected] = useState(currentStatus)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()

    const save = () => {
        if (selected === currentStatus) return
        setSaved(false)
        setError('')
        startTransition(async () => {
            const result = await action(orderId, selected)
            if (result.success) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2500)
            } else {
                setError(typeof result.error === 'string' ? result.error : 'Update failed')
            }
        })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSelected(s)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm capitalize transition-colors text-left',
                            selected === s
                                ? 'bg-[#0f0f0f] text-white font-semibold'
                                : 'text-[#737373] hover:bg-[#f5f5f5] hover:text-[#0f0f0f]'
                        )}
                    >
                        <span className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                            selected === s ? 'border-white' : 'border-[#d4d4d4]'
                        )}>
                            {selected === s && <Check size={9} />}
                        </span>
                        {s}
                    </button>
                ))}
            </div>

            {error && <p className="text-xs text-[#dc2626]">{error}</p>}

            <button
                onClick={save}
                disabled={pending || selected === currentStatus}
                className="h-9 w-full rounded-md bg-[#0f0f0f] text-white text-sm font-semibold hover:bg-[#262626] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
                {saved ? (
                    <><Check size={14} /> Saved</>
                ) : pending ? (
                    'Saving…'
                ) : (
                    'Update Status'
                )}
            </button>
        </div>
    )
}