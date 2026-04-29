import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCartItems } from '@/lib/queries/cart'
import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { ShieldCheck, Lock } from 'lucide-react'
import { CheckoutWrapper } from '@/components/checkout/CheckoutWrapper'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login?next=/checkout')

    const cartItems = await getCartItems(user.id)

    if (cartItems.length === 0) redirect('/cart')

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h1 className="font-display text-3xl font-bold">Checkout</h1>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                    <Lock className="size-3.5" />
                    <span>Secure checkout</span>
                </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-10 text-sm">
                {['Shipping', 'Review', 'Payment'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                        {i > 0 && <div className="h-px w-8 bg-[var(--color-border)]" />}
                        <div className="flex items-center gap-1.5">
                            <span className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-[var(--color-primary)] text-white' : 'border border-[var(--color-border)] text-[var(--color-muted)]'}`}>
                                {i + 1}
                            </span>
                            <span className={i === 0 ? 'font-medium' : 'text-[var(--color-muted)]'}>{step}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <CheckoutWrapper cartItems={cartItems} />
        </div>
    )
}