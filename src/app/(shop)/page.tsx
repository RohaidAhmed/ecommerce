import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/queries/products'
import { getCategories } from '@/lib/queries/categories'
import { formatPrice } from '@/lib/utils'

export const revalidate = 120

export default async function HomePage() {
    const [featured, categories] = await Promise.all([
        getFeaturedProducts(4),
        getCategories(),
    ])

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
                    <div className="max-w-2xl">
                        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">New arrivals</p>
                        <h1 className="font-display text-5xl font-bold leading-tight lg:text-7xl">
                            Designed to<br />
                            <span className="text-[var(--color-accent)]">last.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-300 max-w-lg">
                            Thoughtfully curated products built with craftsmanship and longevity in mind.
                        </p>
                        <div className="mt-10 flex items-center gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                Shop now <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/products"
                                className="text-sm text-gray-300 hover:text-white transition-colors underline underline-offset-4"
                            >
                                Browse all
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Decorative accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <h2 className="font-display text-2xl font-bold mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {categories.slice(0, 8).map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center hover:border-[var(--color-primary)] transition-colors"
                            >
                                <span className="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="font-display text-2xl font-bold">Featured Products</h2>
                        <Link href="/products" className="text-sm text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featured.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow"
                            >
                                <div className="aspect-square bg-[var(--color-surface-2)] relative overflow-hidden">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted)] text-xs">
                                            No image
                                        </div>
                                    )}
                                    {product.compare_at_price && (
                                        <span className="absolute top-2 left-2 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-medium text-white">
                                            Sale
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-[var(--color-muted)] mb-1">{product.category?.name}</p>
                                    <h3 className="font-medium text-sm leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                                        {product.compare_at_price && (
                                            <span className="text-xs text-[var(--color-muted)] line-through">
                                                {formatPrice(product.compare_at_price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}