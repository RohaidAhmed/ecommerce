import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getProductBySlug, getRelatedProducts } from '@/lib/queries/products'
import { formatPrice } from '@/lib/utils'
import { StarRating } from '@/components/product/StarRating'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Link, Package, RotateCcw, ShieldCheck } from 'lucide-react'

import { ReviewForm } from '@/components/product/ReviewForm'
import { WishlistButton } from '@/components/product/WishlistButton'
import { createServerClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateStaticParams() {
    const supabase = (await import('@/lib/supabase/server')).createServerClient
    const client = await supabase()
    const { data } = await client.from('products').select('slug').eq('is_published', true)
    return (data ?? []).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) return { title: 'Not found' }
    return {
        title: product.name,
        description: product.description?.slice(0, 160),
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) notFound()

    const related = product.category_id
        ? await getRelatedProducts(product.category_id, product.id)
        : []

    const avgRating = product.reviews?.length
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0

    const isOnSale = product.compare_at_price && product.compare_at_price > product.price
    const discount = isOnSale
        ? Math.round((1 - product.price / product.compare_at_price!) * 100)
        : null;

    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isWishlisted = false
    if (user) {
        const { data: wl } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .single()
        isWishlisted = !!wl
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-[var(--color-muted)]">
                <ol className="flex items-center gap-2">
                    <li><a href="/products" className="hover:text-[var(--color-primary)] transition-colors">Products</a></li>
                    {product.category && (
                        <>
                            <li>/</li>
                            <li>
                                <a href={`/categories/${product.category.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                                    {product.category.name}
                                </a>
                            </li>
                        </>
                    )}
                    <li>/</li>
                    <li className="text-[var(--color-primary)] font-medium truncate max-w-xs">{product.name}</li>
                </ol>
            </nav>

            {/* Product main */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Images */}
                <div className="space-y-3">
                    <div className="relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-2)]">
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
                            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10">📦</div>
                        )}
                        {discount && (
                            <div className="absolute top-4 left-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white">
                                Save {discount}%
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.slice(0, 5).map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)]">
                                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-6">
                    {product.category && (
                        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">
                            {product.category.name}
                        </p>
                    )}

                    <h1 className="font-display text-3xl font-bold lg:text-4xl leading-tight">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <StarRating rating={avgRating} size="md" showValue />
                            <span className="text-sm text-[var(--color-muted)]">
                                ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                        {isOnSale && (
                            <span className="text-lg text-[var(--color-muted)] line-through">
                                {formatPrice(product.compare_at_price!)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="text-[var(--color-muted-fg)] leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    {/* Stock */}
                    <p className={`text-sm font-medium ${product.inventory_count > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                        {product.inventory_count > 0
                            ? product.inventory_count < 5
                                ? `Only ${product.inventory_count} left in stock`
                                : 'In stock'
                            : 'Out of stock'}
                    </p>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <AddToCartButton product={product} />
                        </div>
                        <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        {[
                            { icon: Package, label: 'Free shipping', sub: 'Orders over $50' },
                            { icon: RotateCcw, label: '30-day returns', sub: 'Hassle-free' },
                            { icon: ShieldCheck, label: 'Secure checkout', sub: 'SSL encrypted' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 text-center">
                                <Icon className="size-5 text-[var(--color-muted)]" />
                                <span className="text-xs font-medium">{label}</span>
                                <span className="text-[10px] text-[var(--color-muted)]">{sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Review list */}
                <div>
                    <h2 className="font-display text-2xl font-bold mb-6">
                        Customer Reviews
                        {product.reviews && product.reviews.length > 0 && (
                            <span className="ml-3 text-base font-normal text-[var(--color-muted)]">
                                ({product.reviews.length})
                            </span>
                        )}
                    </h2>

                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <StarRating rating={review.rating} />
                                        <span className="text-xs text-[var(--color-muted)]">
                                            {new Date(review.created_at).toLocaleDateString('en-PK', {
                                                month: 'short', year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    {review.body && (
                                        <p className="text-sm text-[var(--color-muted-fg)] leading-relaxed">{review.body}</p>
                                    )}
                                    <p className="text-xs font-medium text-[var(--color-muted)]">
                                        {(review as any).profile?.full_name ?? 'Verified buyer'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-muted)]">No reviews yet. Be the first!</p>
                    )}
                </div>

                {/* Review form */}
                {user ? (
                    <ReviewForm productId={product.id} productSlug={product.slug} />
                ) : (
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 text-center space-y-3">
                        <p className="text-sm font-medium">Sign in to leave a review</p>
                        <p className="text-xs text-[var(--color-muted)]">Only verified purchasers can review products.</p>
                        <Link href="/login" className="inline-block rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                            Sign in
                        </Link>
                    </div>
                )}
            </section>

            {/* Related products */}
            {related.length > 0 && (
                <section className="mt-20">
                    <h2 className="font-display text-2xl font-bold mb-6">You might also like</h2>
                    <ProductGrid products={related} />
                </section>
            )}
        </div>
    )
}