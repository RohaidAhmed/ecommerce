import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function requireUser() {
    const user = await getUser()
    if (!user) redirect('/login')
    return user
}

export async function requireAdmin() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/')
    return user
}