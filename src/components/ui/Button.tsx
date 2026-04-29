import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    asChild?: boolean
}

const variants: Record<Variant, string> = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:opacity-90',
    secondary: 'border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-surface-2)]',
    ghost: 'text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)]',
    accent: 'bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90',
}

const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading,
    className,
    children,
    disabled,
    asChild = false,
    ...props
}: ButtonProps) {
    const cls = cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
    )

    if (asChild && isValidElement(children)) {
        return cloneElement(children as ReactElement<{ className?: string }>, { className: cls })
    }

    return (
        <button className={cls} disabled={disabled || loading} {...props}>
            {loading && (
                <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    )
}