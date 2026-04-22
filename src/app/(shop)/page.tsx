// app/(shop)/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
    const supabase = await createServerClient()

    // Fetch featured products (latest 4 published)
    const { data: featured } = await supabase
        .from('products')
        .select('id, name, slug, price, compare_at_price, images')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4)

    // Fetch top-level categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .is('parent_id', null)
        .limit(4)

    return (
        <div className="flex flex-col">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative min-h-[85vh] flex items-end bg-[#0f0f0f] overflow-hidden">

                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
                        alt="Hero — fashion editorial"
                        fill
                        priority
                        className="object-cover opacity-60"
                    />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Hero content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                            New Season — Spring / Summer 2025
                        </p>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-6">
                            Dressed for<br />
                            <span className="italic font-light">every moment.</span>
                        </h1>

                        <p className="text-base sm:text-lg text-white/70 mb-10 max-w-md leading-relaxed">
                            Timeless silhouettes in premium materials. Built for the everyday — and everything beyond it.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 bg-white text-[#0f0f0f] px-7 py-3 rounded-md text-sm font-semibold hover:bg-white/90 transition-colors"
                            >
                                Shop Now
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/products?category=sale"
                                className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-3 rounded-md text-sm font-semibold hover:border-white hover:bg-white/10 transition-colors"
                            >
                                View Sale
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MARQUEE STRIP ────────────────────────────────────────────── */}
            <div className="bg-[#e8440a] text-white py-2.5 overflow-hidden whitespace-nowrap">
                <div className="inline-flex animate-[marquee_20s_linear_infinite] gap-12 pr-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <span key={i} className="text-xs font-semibold uppercase tracking-[0.2em]">
                            Free shipping over $75 &nbsp;·&nbsp; New arrivals every week &nbsp;·&nbsp; Easy 30-day returns
                        </span>
                    ))}
                </div>
            </div>

            {/* ── CATEGORIES ───────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
                            Browse by
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight">Category</h2>
                    </div>
                    <Link
                        href="/products"
                        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#737373] hover:text-[#0f0f0f] transition-colors"
                    >
                        View all <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(categories ?? []).map((cat, i) => {
                        const coverImages = [
                            'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
                            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
                            'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
                            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
                        ]
                        return (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug}`}
                                className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#f5f5f5]"
                            >
                                <Image
                                    src={coverImages[i % coverImages.length]}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-5">
                                    <p className="text-white font-bold text-lg">{cat.name}</p>
                                    <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Shop now <ArrowRight size={11} />
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
                                Hand-picked
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
                        </div>
                        <Link
                            href="/products"
                            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#737373] hover:text-[#0f0f0f] transition-colors"
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {(featured ?? []).map((product) => {
                            const isOnSale =
                                product.compare_at_price != null &&
                                product.compare_at_price > product.price

                            return (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="group flex flex-col gap-3"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#f5f5f5]">
                                        {product.images?.[0] && (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        {isOnSale && (
                                            <span className="absolute top-2 left-2 bg-[#e8440a] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                                Sale
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium text-[#0f0f0f] line-clamp-1 group-hover:underline underline-offset-2">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">
                                                {formatPrice(product.price)}
                                            </span>
                                            {isOnSale && (
                                                <span className="text-xs text-[#737373] line-through">
                                                    {formatPrice(product.compare_at_price!)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── BRAND STRIP ──────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-0 rounded-xl overflow-hidden">
                    {/* Left — editorial image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                        <Image
                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80"
                            alt="Brand story"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Right — copy */}
                    <div className="bg-[#0f0f0f] text-white flex flex-col justify-center px-12 py-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40 mb-4">
                            Our Philosophy
                        </p>
                        <h2 className="text-3xl font-bold leading-snug mb-6">
                            Less, but<br />
                            <span className="italic font-light">better.</span>
                        </h2>
                        <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-sm">
                            We believe in buying fewer things, choosing them carefully, and keeping them for a long time. Every piece we carry is made to last — in quality and in style.
                        </p>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors w-fit"
                        >
                            Read our story <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}