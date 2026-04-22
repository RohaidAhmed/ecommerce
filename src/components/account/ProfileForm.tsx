'use client'

// components/account/ProfileForm.tsx

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SubmitButton } from '@/components/ui/SubmitButton'

type Props = {
    userId: string
    email: string
    fullName: string
    avatarUrl: string
}

export function ProfileForm({ userId, email, fullName, avatarUrl }: Props) {
    const [name, setName] = useState(fullName)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSuccess(false)
        setError('')

        startTransition(async () => {
            const supabase = createClient()
            const { error: err } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', userId)

            if (err) {
                setError(err.message)
            } else {
                setSuccess(true)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {success && (
                <div className="rounded-md bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-3">
                    <p className="text-sm text-[#16a34a]">Profile updated successfully.</p>
                </div>
            )}
            {error && (
                <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
                    <p className="text-sm text-[#dc2626]">{error}</p>
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#737373]">
                    Email
                </label>
                <p className="text-sm text-[#0f0f0f] py-2.5 border-b border-[#e5e5e5] text-[#737373]">
                    {email}
                </p>
                <p className="text-xs text-[#737373]">Email cannot be changed here.</p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="full_name"
                    className="text-xs font-semibold uppercase tracking-widest text-[#737373]"
                >
                    Full name
                </label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-none border-b border-[#e5e5e5] bg-transparent py-2.5 text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] transition-colors"
                />
            </div>

            <SubmitButton className="mt-2 max-w-[200px]">Save Changes</SubmitButton>
        </form>
    )
}