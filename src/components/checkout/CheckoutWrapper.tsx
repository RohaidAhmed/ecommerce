// components/checkout/CheckoutWrapper.tsx (Client Component)
'use client'

import type { CartItem } from '@/types'
import { CheckoutClient } from './CheckoutClient'

interface CheckoutWrapperProps {
    cartItems: CartItem[]
}

export function CheckoutWrapper({ cartItems }: CheckoutWrapperProps) {
    return <CheckoutClient cartItems={cartItems} />
}