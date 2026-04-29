import type { Metadata } from 'next'
import { requireUser } from '@/lib/utils/auth'
import { getProfile } from '@/lib/queries/users'
import { ProfileForm } from '@/components/account/ProfileForm'
import { PasswordForm } from '@/components/account/PasswordForm'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
    const user = await requireUser()
    const profile = await getProfile(user.id)

    return (
        <div className="space-y-10">
            <h1 className="font-display text-2xl font-bold">Profile</h1>

            <div className="space-y-8 divide-y divide-[var(--color-border)]">
                <section className="space-y-5">
                    <div>
                        <h2 className="font-semibold">Personal Information</h2>
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">Update your display name.</p>
                    </div>
                    <ProfileForm
                        defaultName={profile?.full_name ?? ''}
                        email={user.email ?? ''}
                    />
                </section>

                <section className="space-y-5 pt-8">
                    <div>
                        <h2 className="font-semibold">Change Password</h2>
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">Choose a new password.</p>
                    </div>
                    <PasswordForm />
                </section>
            </div>
        </div>
    )
}