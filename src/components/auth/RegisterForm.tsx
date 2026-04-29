'use client'
import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FormState = { error?: Record<string, string[]> } | null

export function RegisterForm() {
    const [state, action, pending] = useActionState<FormState, FormData>(registerAction, null)

    return (
        <form action={action} className="space-y-5">
            {state?.error && 'root' in state.error && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            <Input
                label="Full name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Doe"
                error={state?.error?.full_name?.[0]}
            />

            <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                error={state?.error?.email?.[0]}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="At least 8 characters"
                error={state?.error?.password?.[0]}
            />

            <Input
                label="Confirm password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                error={state?.error?.confirm_password?.[0]}
            />

            <Button type="submit" loading={pending} className="w-full" size="lg">
                Create account
            </Button>

            <p className="text-center text-xs text-[var(--color-muted)]">
                By creating an account you agree to our{' '}
                <a href="/terms" className="underline underline-offset-2 hover:text-[var(--color-primary)]">Terms</a>{' '}
                and{' '}
                <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-primary)]">Privacy Policy</a>.
            </p>
        </form>
    )
}