'use client'

// components/auth/RegisterForm.tsx

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'
import type { ActionResult } from '@/types'

const initialState: ActionResult = { success: false, error: '' }

export function RegisterForm() {
    const [state, formAction] = useActionState(registerAction, initialState)

    const fieldErrors =
        state.success === false && typeof state.error === 'object'
            ? state.error
            : {}

    const globalError =
        state.success === false && typeof state.error === 'string'
            ? state.error
            : null

    return (
        <>
            {state.success && (
                <div className="mb-6 rounded-md bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-3">
                    <p className="text-sm text-[#16a34a]">
                        Account created! Check your email to confirm your address.
                    </p>
                </div>
            )}

            {globalError && (
                <div className="mb-6 rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
                    <p className="text-sm text-[#dc2626]">{globalError}</p>
                </div>
            )}

            <form action={formAction} className="flex flex-col gap-5">
                <FormField
                    label="Full name"
                    name="full_name"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    required
                    error={fieldErrors.full_name}
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    error={fieldErrors.email}
                />
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    error={fieldErrors.password}
                />
                <FormField
                    label="Confirm password"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    required
                    error={fieldErrors.confirm_password}
                />

                <SubmitButton className="mt-2">Create account</SubmitButton>
            </form>
        </>
    )
}