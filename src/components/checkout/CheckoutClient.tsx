'use client';
import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout.schema'
import { placeOrder } from '@/lib/actions/order.actions'
import { useCartStore } from '@/store/cart.store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { MapPin, Banknote, ShieldCheck } from 'lucide-react'
import type { CartItem } from '@/types'

interface CheckoutClientProps {
    cartItems: CartItem[]
}

export function CheckoutClient({ cartItems }: CheckoutClientProps) {
    const [serverError, setServerError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const { clear } = useCartStore()

    const subtotal = cartItems.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0)
    const shipping = subtotal >= 50 ? 0 : 9.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutInput>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { country: 'PK' },
    })

    function onSubmit(data: CheckoutInput) {
        setServerError(null)
        startTransition(async () => {
            try {
                clear()
                await placeOrder(cartItems, data)
            } catch (err: any) {
                setServerError(err.message ?? 'Something went wrong. Please try again.')
            }
        })
    }

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            {/* ── Form ───────────────────────── 3 cols */}
            <div className="lg:col-span-3 space-y-8">
                {serverError && (
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Shipping address */}
                    <section className="space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-[var(--color-border)]">
                            <MapPin className="size-4 text-[var(--color-muted)]" />
                            <h2 className="font-semibold">Shipping Address</h2>
                        </div>

                        <Input
                            label="Street address"
                            placeholder="House 12, Block B, Gulberg III"
                            error={errors.line1?.message}
                            {...register('line1')}
                        />

                        <Input
                            label="Area / Landmark (optional)"
                            placeholder="Near XYZ Hospital"
                            error={errors.line2?.message}
                            {...register('line2')}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="City"
                                placeholder="Lahore"
                                error={errors.city?.message}
                                {...register('city')}
                            />
                            <Input
                                label="Province"
                                placeholder="Punjab"
                                error={errors.state?.message}
                                {...register('state')}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Postal code"
                                placeholder="54000"
                                error={errors.postal_code?.message}
                                {...register('postal_code')}
                            />
                            <Input
                                label="Country"
                                placeholder="PK"
                                maxLength={2}
                                error={errors.country?.message}
                                {...register('country')}
                            />
                        </div>
                    </section>

                    {/* Payment method — COD only */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-[var(--color-border)]">
                            <Banknote className="size-4 text-[var(--color-muted)]" />
                            <h2 className="font-semibold">Payment Method</h2>
                        </div>

                        {/* COD tile — pre-selected, single option for now */}
                        <label className="flex items-start gap-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-primary)] bg-[var(--color-surface-2)] p-4 cursor-pointer">
                            <input type="radio" name="payment_method" value="cod" defaultChecked readOnly className="mt-0.5 accent-[var(--color-primary)]" />
                            <div>
                                <p className="font-medium text-sm">Cash on Delivery</p>
                                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                                    Pay in cash when your order arrives. No card required.
                                </p>
                            </div>
                            <span className="ml-auto text-xl">💵</span>
                        </label>

                        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-4 py-3 text-xs text-[var(--color-muted-fg)]">
                            <ShieldCheck className="size-4 shrink-0 text-[var(--color-success)]" />
                            More payment options (card, Easypaisa, JazzCash) coming soon.
                        </div>
                    </section>

                    <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        loading={isPending}
                        className="w-full text-base"
                    >
                        Place Order — {formatPrice(total)}
                    </Button>
                </form>
            </div>

            {/* ── Order summary ───────────────── 2 cols */}
            <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-5">
                    <h2 className="font-semibold">Order Summary</h2>

                    <div className="space-y-3 divide-y divide-[var(--color-border)]">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                                <div className="relative size-14 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                                    {item.product?.images?.[0] && (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-muted)] text-[9px] font-bold text-white">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                    <p className="text-sm font-medium leading-snug line-clamp-2">
                                        {item.product?.name}
                                    </p>
                                    <p className="text-sm font-semibold shrink-0">
                                        {formatPrice((item.product?.price ?? 0) * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Shipping</span>
                            <span className={shipping === 0 ? 'text-[var(--color-success)] font-medium' : ''}>
                                {shipping === 0 ? 'Free' : formatPrice(shipping)}
                            </span>
                        </div>
                        <div className="flex justify-between text-[var(--color-muted-fg)]">
                            <span>Tax (est. 8%)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-[var(--color-border)] pt-3 mt-1">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <p className="text-xs text-center text-[var(--color-muted)]">
                        You pay when the order is delivered to your door.
                    </p>
                </div>
            </div>
        </div>
    )
}