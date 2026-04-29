'use client'
import { useActionState, useState } from 'react'
import { submitReview } from '@/lib/actions/review.actions'
import { Button } from '@/components/ui/Button'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type State = { error?: Record<string, string[]>; success?: boolean } | null

interface ReviewFormProps {
    productId: string
    productSlug: string
}

export function ReviewForm({ productId, productSlug }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hovered, setHovered] = useState(0)
    const [state, action, pending] = useActionState<State, FormData>(submitReview, null)

    if (state?.success) {
        return (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 px-5 py-4 text-sm text-[var(--color-success)]">
                ✓ Your review has been submitted. Thank you!
            </div>
        )
    }

    return (
        <form action={action} className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
            <h3 className="font-semibold">Write a Review</h3>

            {state?.error?.root && (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]">
                    {state.error.root[0]}
                </div>
            )}

            {/* Hidden fields */}
            <input type="hidden" name="product_id" value={productId} />
            <input type="hidden" name="rating" value={rating} />

            {/* Star picker */}
            <div className="space-y-1.5">
                <p className="text-sm font-medium text-[var(--color-muted-fg)]">Your rating</p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            className="p-0.5 transition-transform hover:scale-110"
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                            <Star
                                className={cn(
                                    'size-7 transition-colors',
                                    (hovered || rating) >= star
                                        ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                                        : 'fill-transparent text-[var(--color-border)]'
                                )}
                            />
                        </button>
                    ))}
                </div>
                {state?.error?.rating && (
                    <p className="text-xs text-[var(--color-error)]">{state.error.rating[0]}</p>
                )}
            </div>

            {/* Body */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-muted-fg)]" htmlFor="review-body">
                    Your review
                </label>
                <textarea
                    id="review-body"
                    name="body"
                    rows={4}
                    required
                    placeholder="Share your experience with this product…"
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-colors resize-none"
                />
                {state?.error?.body && (
                    <p className="text-xs text-[var(--color-error)]">{state.error.body[0]}</p>
                )}
            </div>

            <Button type="submit" loading={pending} disabled={rating === 0} size="md">
                Submit review
            </Button>
        </form>
    )
}