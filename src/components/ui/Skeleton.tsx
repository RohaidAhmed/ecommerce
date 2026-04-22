// components/ui/Skeleton.tsx

import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-[#e5e5e5]',
                className
            )}
        />
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}