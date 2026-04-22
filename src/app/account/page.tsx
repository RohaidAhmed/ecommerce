// app/account/page.tsx

import { requireUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/account/ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Profile' }

export default async function AccountPage() {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, role')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-bold tracking-tight mb-8">Profile</h1>
            <ProfileForm
                userId={user.id}
                email={user.email ?? ''}
                fullName={profile?.full_name ?? ''}
                avatarUrl={profile?.avatar_url ?? ''}
            />
        </div>
    )
}