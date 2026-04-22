// types/index.ts

export type Product = {
    id: string
    slug: string
    name: string
    description: string
    price: number
    compare_at_price: number | null
    category_id: string
    inventory_count: number
    is_published: boolean
    images: string[]
    created_at: string
    category?: Category
    reviews?: Review[]
}

export type Category = {
    id: string
    name: string
    slug: string
    parent_id: string | null
}

export type CartItem = {
    id: string
    cart_id: string
    product_id: string
    variant_id: string | null
    quantity: number
    product?: Product
}

export type Order = {
    id: string
    user_id: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    total_amount: number
    stripe_payment_intent_id: string
    shipping_address: Address
    created_at: string
    items?: OrderItem[]
}

export type OrderItem = {
    id: string
    order_id: string
    product_id: string
    quantity: number
    unit_price: number
    product?: Product
}

export type Address = {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
}

export type Review = {
    id: string
    product_id: string
    user_id: string
    rating: number
    body: string
    created_at: string
}

export type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: 'customer' | 'admin'
    created_at: string
}

export type Wishlist = {
    id: string
    user_id: string
    product_id: string
    created_at: string
    product?: Product
}

// Action result types
export type ActionResult<T = void> =
    | { success: true; data?: T }
    | { success: false; error: string | Record<string, string[]> | null }