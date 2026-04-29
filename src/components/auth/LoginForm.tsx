'use client'
import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FormState = { error?: Record<string, string[]> } | null

export function LoginForm() {
    const [state, action, pending] = useActionState<FormState, FormData>(loginAction, null)

    return (
        <form action={action} className="space-y-5">
            {/* Root error */}
            {state?.error && 'root' in state.error && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                error={state?.error?.email?.[0]}
            />

            <div className="space-y-1">
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    error={state?.error?.password?.[0]}
                />
                <div className="text-right">
                    <a href="#" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                        Forgot password?
                    </a>
                </div>
            </div>

            <Button type="submit" loading={pending} className="w-full" size="lg">
                Sign in
            </Button>
        </form>
    )
}