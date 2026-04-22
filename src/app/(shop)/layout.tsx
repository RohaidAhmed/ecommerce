// app/(shop)/layout.tsx

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getOptionalUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const user = await getOptionalUser()

    // Fetch cart item count for nav badge
    let cartCount = 0
    if (user) {
        const supabase = await createServerClient()
        const { count } = await supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('cart_id', user.id)
        cartCount = count ?? 0
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user} cartCount={cartCount} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}