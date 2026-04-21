// lib/utils/auth.ts

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

/** Get the current user or redirect to /login */
export async function requireUser() {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')
    return user
}

/** Get the current user + profile or redirect */
export async function requireAdmin() {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/')

    return user
}

/** Get current user without redirecting (returns null if not logged in) */
export async function getOptionalUser() {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}