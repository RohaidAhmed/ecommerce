'use client'

// components/ui/SubmitButton.tsx

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'

type Props = {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'outline' | 'ghost'
}

export function SubmitButton({ children, className, variant = 'primary' }: Props) {
    const { pending } = useFormStatus()

    const base =
        'inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary:
            'h-11 w-full bg-[#0f0f0f] text-white hover:bg-[#262626] rounded-md',
        outline:
            'h-11 w-full border border-[#0f0f0f] text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white rounded-md',
        ghost:
            'h-9 px-4 text-[#0f0f0f] hover:bg-[#f5f5f5] rounded-md',
    }

    return (
        <button
            type="submit"
            disabled={pending}
            className={cn(base, variants[variant], className)}
        >
            {pending ? (
                <>
                    <Spinner />
                    {children}
                </>
            ) : (
                children
            )}
        </button>
    )
}

function Spinner() {
    return (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    )
}