// app/(auth)/layout.tsx

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left panel — brand */}
            <div
                className="hidden lg:flex flex-col justify-between p-16 bg-[#0f0f0f] text-white relative overflow-hidden"
                aria-hidden="true"
            >
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Decorative circle */}
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full border border-white/10" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full border border-white/5" />

                {/* Logo */}
                <Link href="/" className="relative z-10 text-xl font-bold tracking-tight">
                    GUPPU BABY
                </Link>

                {/* Quote */}
                <div className="relative z-10">
                    <blockquote className="text-3xl font-light leading-snug text-white/90 mb-6">
                        "Style is a way to say who you are without having to speak."
                    </blockquote>
                    <cite className="text-sm text-white/40 not-italic">— Rachel Zoe</cite>
                </div>

                {/* Bottom note */}
                <p className="relative z-10 text-xs text-white/30">
                    © {new Date().getFullYear()} Guppu Baby. All rights reserved.
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-col justify-center px-8 py-16 sm:px-16 lg:px-24 bg-[#fafafa]">
                {/* Mobile logo */}
                <Link href="/" className="mb-12 text-xl font-bold tracking-tight lg:hidden">
                    GUPPU BABY
                </Link>
                {children}
            </div>
        </div>
    )
}