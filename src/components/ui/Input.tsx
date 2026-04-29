import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-muted-fg)]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm',
                        'placeholder:text-[var(--color-muted)] outline-none',
                        'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10',
                        'transition-colors duration-150',
                        error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/10',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'