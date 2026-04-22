// app/(shop)/products/[slug]/page.tsx

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingBag, Heart, Star, ChevronLeft } from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '@/lib/queries/products'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/product/ProductCard'
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) return { title: 'Product not found' }

    return {
        title: product.name,
        description: product.description ?? undefined,
        openGraph: {
            title: product.name,
            description: product.description ?? undefined,
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) notFound()

    const related = product.category_id
        ? await getRelatedProducts(product.category_id, product.id)
        : []

    const isOnSale =
        product.compare_at_price != null && product.compare_at_price > product.price
    const isOutOfStock = product.inventory_count === 0
    const avgRating =
        product.reviews?.length
            ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
            : null

    const discount = isOnSale
        ? Math.round((1 - product.price / product.compare_at_price!) * 100)
        : null

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Breadcrumb */}
            <nav className="text-xs text-[#737373] mb-8 flex items-center gap-1.5">
                <Link href="/" className="hover:text-[#0f0f0f] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-[#0f0f0f] transition-colors">Products</Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/products?category=${product.category.slug}`}
                            className="hover:text-[#0f0f0f] transition-colors"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-[#0f0f0f] font-medium line-clamp-1">{product.name}</span>
            </nav>

            {/* Main grid */}
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

                {/* Images */}
                <div className="flex flex-col gap-3">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f5f5]">
                        {product.images?.[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[#d4d4d4]">
                                <ShoppingBag size={64} strokeWidth={0.8} />
                            </div>
                        )}
                        {discount && (
                            <div className="absolute top-4 left-4 bg-[#e8440a] text-white text-xs font-bold px-2.5 py-1 rounded">
                                -{discount}%
                            </div>
                        )}
                    </div>
                    {/* Thumbnail strip */}
                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.slice(1, 6).map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-[#f5f5f5]">
                                    <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className="flex flex-col gap-6 lg:py-4">

                    {/* Category + name */}
                    <div>
                        {product.category && (
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="text-xs font-semibold uppercase tracking-widest text-[#737373] hover:text-[#0f0f0f] transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight mt-2">{product.name}</h1>

                        {/* Rating */}
                        {avgRating !== null && (
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < Math.round(avgRating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e5e5e5] fill-[#e5e5e5]'}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-[#737373]">
                                    {avgRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className={`text-3xl font-bold ${isOnSale ? 'text-[#e8440a]' : ''}`}>
                            {formatPrice(product.price)}
                        </span>
                        {isOnSale && (
                            <span className="text-lg text-[#737373] line-through">
                                {formatPrice(product.compare_at_price!)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm text-[#737373] leading-relaxed">{product.description}</p>
                    )}

                    <div className="border-t border-[#e5e5e5]" />

                    {/* Stock status */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-[#dc2626]' : 'bg-[#16a34a]'}`}
                        />
                        <span className="text-sm font-medium text-[#737373]">
                            {isOutOfStock
                                ? 'Out of stock'
                                : product.inventory_count < 10
                                    ? `Only ${product.inventory_count} left`
                                    : 'In stock'}
                        </span>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col gap-3">
                        <form>
                            <button
                                type="submit"
                                disabled={isOutOfStock}
                                className="w-full h-12 bg-[#0f0f0f] text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={18} />
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </form>
                        <button className="w-full h-12 border border-[#e5e5e5] rounded-md text-sm font-semibold flex items-center justify-center gap-2 text-[#737373] hover:border-[#0f0f0f] hover:text-[#0f0f0f] transition-colors">
                            <Heart size={16} />
                            Save to Wishlist
                        </button>
                    </div>

                    {/* Shipping note */}
                    <p className="text-xs text-[#737373] text-center">
                        Free shipping on orders over $75 · 30-day returns
                    </p>
                </div>
            </div>

            {/* Reviews section */}
            {(product.reviews?.length ?? 0) > 0 && (
                <section className="mt-20">
                    <h2 className="text-2xl font-bold mb-8">
                        Reviews ({product.reviews.length})
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.reviews.map((review: any) => (
                            <div key={review.id} className="bg-white rounded-lg border border-[#e5e5e5] p-5">
                                <div className="flex items-center gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            className={i < review.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e5e5e5] fill-[#e5e5e5]'}
                                        />
                                    ))}
                                </div>
                                {review.body && (
                                    <p className="text-sm text-[#737373] leading-relaxed">{review.body}</p>
                                )}
                                <p className="text-xs text-[#d4d4d4] mt-3">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Related products */}
            {related.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-2xl font-bold mb-8">You may also like</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}