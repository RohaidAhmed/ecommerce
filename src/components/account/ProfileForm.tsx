'use client'
import { useActionState } from 'react'
import { updateProfile } from '@/lib/actions/profile.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type State = { error?: Record<string, string[]>; success?: boolean } | null

export function ProfileForm({ defaultName, email }: { defaultName: string; email: string }) {
    const [state, action, pending] = useActionState<State, FormData>(updateProfile, null)

    return (
        <form action={action} className="space-y-4 max-w-md">
            {state?.success && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 px-4 py-3 text-sm text-[var(--color-success)]">
                    Profile updated successfully.
                </div>
            )}
            {state?.error?.root && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            <Input
                label="Full name"
                name="full_name"
                defaultValue={defaultName}
                error={state?.error?.full_name?.[0]}
            />

            <Input
                label="Email address"
                type="email"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed"
            />

            <Button type="submit" loading={pending} size="md">
                Save changes
            </Button>
        </form>
    )
}