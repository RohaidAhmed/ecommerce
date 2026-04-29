'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
    initialValue?: string
    placeholder?: string
}

export function SearchBar({ initialValue = '', placeholder = 'Search products…' }: SearchBarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isPending, startTransition] = useTransition()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const q = inputRef.current?.value.trim()
        const params = new URLSearchParams(searchParams.toString())
        if (q) params.set('q', q)
        else params.delete('q')
        params.delete('page')
        startTransition(() => router.push(`/search?${params.toString()}`))
    }

    function handleClear() {
        if (inputRef.current) inputRef.current.value = ''
        startTransition(() => router.push('/search'))
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
                <Search className="absolute left-4 size-4 text-[var(--color-muted)] pointer-events-none" />
                <input
                    ref={inputRef}
                    type="search"
                    defaultValue={initialValue}
                    placeholder={placeholder}
                    className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-12 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                />
                {initialValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-14 p-1 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isPending ? '…' : 'Go'}
                </button>
            </div>
        </form>
    )
}