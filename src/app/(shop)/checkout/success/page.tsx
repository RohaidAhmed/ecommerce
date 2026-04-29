import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { CheckCircle2, Package, ArrowRight, Banknote } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Order Confirmed' }

type Props = { searchParams: Promise<{ order_id?: string }> }

export default async function CheckoutSuccessPage({ searchParams }: Props) {
    const { order_id } = await searchParams

    let order: { id: string; total_amount: number; status: string } | null = null

    if (order_id) {
        const supabase = await createServerClient()
        const { data } = await supabase
            .from('orders')
            .select('id, total_amount, status')
            .eq('id', order_id)
            .single()
        order = data
    }

    return (
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="size-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                        <CheckCircle2 className="size-10 text-[var(--color-success)]" />
                    </div>
                </div>

                {/* Heading */}
                <div className="space-y-3">
                    <h1 className="font-display text-4xl font-bold">Order placed!</h1>
                    <p className="text-[var(--color-muted-fg)]">
                        Your order has been received and is being prepared.
                    </p>
                    {order && (
                        <div className="inline-flex flex-col items-center gap-1">
                            <span className="text-2xl font-bold">{formatPrice(order.total_amount)}</span>
                            <span className="text-xs font-mono text-[var(--color-muted)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* COD notice */}
                <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-4 text-left">
                    <Banknote className="size-8 shrink-0 text-[var(--color-success)]" />
                    <div>
                        <p className="font-semibold text-sm">Cash on Delivery</p>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">
                            Please have the exact amount ready when our rider arrives.
                        </p>
                    </div>
                </div>

                {/* What's next */}
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-left space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                        What happens next
                    </h2>
                    {[
                        { icon: '✅', title: 'Order confirmed', desc: 'We\'ve received your order and are preparing it.' },
                        { icon: '📦', title: 'Packed & dispatched', desc: 'Your items will be packed and handed to the courier.' },
                        { icon: '🚚', title: 'Out for delivery', desc: 'Our rider will call before arriving.' },
                        { icon: '💵', title: 'Pay on delivery', desc: 'Pay the rider in cash — exact amount preferred.' },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} className="flex gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{icon}</span>
                            <div>
                                <p className="text-sm font-medium">{title}</p>
                                <p className="text-xs text-[var(--color-muted)]">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        <Package className="size-4" /> Track my orders
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-6 py-3 text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                        Continue shopping <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}