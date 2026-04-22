// components/ui/Button.tsx

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    asChild?: boolean
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const base =
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f0f0f]'

    const variants = {
        primary: 'bg-[#0f0f0f] text-white hover:bg-[#262626] rounded-md',
        outline: 'border border-[#0f0f0f] text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white rounded-md',
        ghost: 'text-[#0f0f0f] hover:bg-[#f5f5f5] rounded-md',
        destructive: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] rounded-md',
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
    }

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    )
}