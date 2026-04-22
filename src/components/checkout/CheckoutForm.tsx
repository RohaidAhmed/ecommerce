'use client'

// components/checkout/CheckoutForm.tsx

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createOrderAction } from '@/lib/actions/checkout.actions'
import { FormField } from '@/components/ui/FormField'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ShieldCheck } from 'lucide-react'
import type { ActionResult } from '@/types'

const initial: ActionResult<{ orderId: string; redirect?: string }> = {
    success: false,
    error: '',
}

export function CheckoutForm({ userEmail }: { userEmail: string }) {
    const router = useRouter()
    const [state, action] = useActionState(createOrderAction, initial)

    useEffect(() => {
        if (state.success && state.data?.redirect) {
            router.push(state.data.redirect)
        }
    }, [state, router])

    const fieldErrors =
        !state.success && typeof state.error === 'object' ? state.error : {}
    const globalError =
        !state.success && typeof state.error === 'string' && state.error
            ? state.error
            : null

    return (
        <form action={action} className="flex flex-col gap-8">
            {/* Contact */}
            <section className="flex flex-col gap-5">
                <h2 className="text-base font-bold">Contact</h2>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={userEmail}
                    required
                    error={fieldErrors?.email}
                />
            </section>

            {/* Shipping address */}
            <section className="flex flex-col gap-5">
                <h2 className="text-base font-bold">Shipping Address</h2>

                <FormField
                    label="Street address"
                    name="line1"
                    placeholder="123 Main Street"
                    autoComplete="address-line1"
                    required
                    error={(fieldErrors as any)['shipping_address.line1']}
                />
                <FormField
                    label="Apartment, suite, etc. (optional)"
                    name="line2"
                    placeholder="Apt 4B"
                    autoComplete="address-line2"
                />

                <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                        label="City"
                        name="city"
                        placeholder="Islamabad"
                        autoComplete="address-level2"
                        required
                    />
                    <FormField
                        label="State / Province"
                        name="state"
                        placeholder="Punjab"
                        autoComplete="address-level1"
                        required
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                        label="Postal code"
                        name="postal_code"
                        placeholder="44000"
                        autoComplete="postal-code"
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-[#737373]">
                            Country
                        </label>
                        <select
                            name="country"
                            required
                            defaultValue="PK"
                            className="w-full rounded-none border-b border-[#e5e5e5] bg-transparent py-2.5 text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] transition-colors"
                        >
                            <option value="PK">Pakistan</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AE">UAE</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Error */}
            {globalError && (
                <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-4 py-3">
                    <p className="text-sm text-[#dc2626]">{globalError}</p>
                </div>
            )}

            {/* Submit */}
            <div className="flex flex-col gap-3">
                <SubmitButton className="">
                    Place Order & Pay
                </SubmitButton>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#737373]">
                    <ShieldCheck size={13} />
                    Secure checkout — your data is encrypted
                </div>
            </div>
        </form>
    )
}