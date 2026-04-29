import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    max?: number
    size?: 'sm' | 'md'
    showValue?: boolean
}

export function StarRating({ rating, max = 5, size = 'sm', showValue = false }: StarRatingProps) {
    const starSize = size === 'sm' ? 'size-3.5' : 'size-5'

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: max }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            starSize,
                            i < Math.round(rating)
                                ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                                : 'fill-transparent text-[var(--color-border)]'
                        )}
                    />
                ))}
            </div>
            {showValue && (
                <span className="text-sm text-[var(--color-muted-fg)]">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}