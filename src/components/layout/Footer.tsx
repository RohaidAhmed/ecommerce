// components/layout/Footer.tsx

import Link from 'next/link'

const columns = [
    {
        heading: 'Shop',
        links: [
            { label: 'Men', href: '/products?category=men' },
            { label: 'Women', href: '/products?category=women' },
            { label: 'Accessories', href: '/products?category=accessories' },
            { label: 'Sale', href: '/products?category=sale' },
        ],
    },
    {
        heading: 'Help',
        links: [
            { label: 'Sizing Guide', href: '/sizing' },
            { label: 'Shipping', href: '/shipping' },
            { label: 'Returns', href: '/returns' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Sustainability', href: '/sustainability' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
        ],
    },
]

export function Footer() {
    return (
        <footer className="border-t border-[#e5e5e5] bg-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {/* Brand column */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="text-xl font-bold tracking-tight">
                            GUPPU BABY
                        </Link>
                        <p className="mt-4 text-sm text-[#737373] leading-relaxed max-w-xs">
                            Curated essentials for modern living. Timeless pieces, crafted with care.
                        </p>
                        {/* Social */}
                        <div className="mt-6 flex gap-4">
                            {['Instagram', 'Twitter', 'Pinterest'].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    aria-label={s}
                                    className="text-xs text-[#737373] hover:text-[#0f0f0f] underline-offset-4 hover:underline transition-colors"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0f0f0f] mb-4">
                                {col.heading}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#737373] hover:text-[#0f0f0f] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-[#e5e5e5] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#737373]">
                        © {new Date().getFullYear()} Guppu Baby. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-xs text-[#737373] hover:text-[#0f0f0f] transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}