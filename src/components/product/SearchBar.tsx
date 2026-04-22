'use client'

// components/product/SearchBar.tsx

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) {
            params.set('search', e.target.value)
        } else {
            params.delete('search')
        }
        params.delete('page')
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    const clear = () => {
        if (inputRef.current) inputRef.current.value = ''
        const params = new URLSearchParams(searchParams.toString())
        params.delete('search')
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="relative w-full max-w-sm">
            <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
            <input
                ref={inputRef}
                type="search"
                placeholder="Search products…"
                defaultValue={defaultValue}
                onChange={handleChange}
                className="w-full h-9 pl-9 pr-8 rounded-md border border-[#e5e5e5] bg-white text-sm text-[#0f0f0f] placeholder:text-[#d4d4d4] outline-none focus:border-[#0f0f0f] transition-colors"
            />
            {defaultValue && (
                <button
                    onClick={clear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0f0f0f]"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    )
}