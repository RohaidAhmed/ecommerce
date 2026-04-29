'use client'
import { useActionState } from 'react'
import { updatePassword } from '@/lib/actions/profile.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type State = { error?: Record<string, string[]>; success?: boolean } | null

export function PasswordForm() {
    const [state, action, pending] = useActionState<State, FormData>(updatePassword, null)

    return (
        <form action={action} className="space-y-4 max-w-md">
            {state?.success && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 px-4 py-3 text-sm text-[var(--color-success)]">
                    Password updated successfully.
                </div>
            )}
            {state?.error?.root && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            <Input
                label="New password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                error={state?.error?.password?.[0]}
            />
            <Input
                label="Confirm new password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                error={state?.error?.confirm_password?.[0]}
            />

            <Button type="submit" loading={pending} size="md">
                Update password
            </Button>
        </form>
    )
}