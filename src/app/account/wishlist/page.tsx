// app/account/wishlist/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2 } from 'lucide-react'
import { requireUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Wishlist' }

export default async function WishlistPage() {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id, product:products(id, name, slug, price, compare_at_price, images)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const items = (wishlist ?? []) as any[]

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight mb-8">
                Wishlist {items.length > 0 && <span className="text-[#737373] font-normal">({items.length})</span>}
            </h1>

            {!items.length ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <Heart size={40} className="text-[#d4d4d4] mb-4" />
                    <p className="font-medium mb-1">Your wishlist is empty</p>
                    <p className="text-sm text-[#737373] mb-6">
                        Save items you love and come back to them later.
                    </p>
                    <Link
                        href="/products"
                        className="text-sm font-semibold text-[#0f0f0f] underline-offset-4 hover:underline"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                    {items.map((item) => {
                        const p = item.product
                        const isOnSale = p.compare_at_price != null && p.compare_at_price > p.price

                        return (
                            <div key={item.id} className="group flex flex-col gap-3 relative">
                                {/* Remove button */}
                                <form action={async () => {
                                    'use server'
                                    const { createServerClient: sc } = await import('@/lib/supabase/server')
                                    const { revalidatePath } = await import('next/cache')
                                    const s = await sc()
                                    await s.from('wishlists').delete().eq('id', item.id)
                                    revalidatePath('/account/wishlist')
                                }}>
                                    <button
                                        type="submit"
                                        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-[#737373] hover:text-[#dc2626] opacity-0 group-hover:opacity-100 transition-all"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </form>

                                <Link href={`/products/${p.slug}`} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#f5f5f5]">
                                    {p.images?.[0] && (
                                        <Image
                                            src={p.images[0]}
                                            alt={p.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    {isOnSale && (
                                        <span className="absolute top-2 left-2 bg-[#e8440a] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            Sale
                                        </span>
                                    )}
                                </Link>

                                <div className="flex flex-col gap-1">
                                    <Link href={`/products/${p.slug}`} className="text-sm font-medium hover:underline underline-offset-2">
                                        {p.name}
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${isOnSale ? 'text-[#e8440a]' : ''}`}>
                                            {formatPrice(p.price)}
                                        </span>
                                        {isOnSale && (
                                            <span className="text-xs text-[#737373] line-through">
                                                {formatPrice(p.compare_at_price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}