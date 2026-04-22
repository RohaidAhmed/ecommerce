// app/not-found.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-[#fafafa]">
            <p className="text-8xl font-bold text-[#e5e5e5] leading-none select-none mb-2">
                404
            </p>
            <h1 className="text-2xl font-bold text-[#0f0f0f] mb-3">Page not found</h1>
            <p className="text-sm text-[#737373] mb-8 max-w-xs">
                Sorry, we couldn&apos;t find what you were looking for. It may have been moved or removed.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f0f0f] underline-offset-4 hover:underline"
            >
                <ArrowLeft size={14} />
                Back to home
            </Link>
        </div>
    )
}