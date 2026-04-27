// app/account/settings/page.tsx

import { requireUser } from '@/lib/utils/auth'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/account/ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings — Account' }

export default async function AccountSettingsPage() {
    const user = await requireUser()
    const supabase = await createServerClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-[#737373]">Profile not found.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

            <div className="max-w-md">
                <ProfileForm
                    userId={user.id}
                    email={user.email ?? ''}
                    fullName={profile.full_name ?? ''}
                    avatarUrl={profile.avatar_url ?? ''}
                />
            </div>
        </div>
    )
}