import type { Metadata } from 'next'
import { adminGetAllUsers } from '@/lib/queries/admin'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'

export const metadata: Metadata = { title: 'Users — Admin' }

export default async function AdminUsersPage() {
    const { users, count } = await adminGetAllUsers()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold">Users</h1>
                <p className="text-sm text-[var(--color-muted)] mt-0.5">{count} registered users</p>
            </div>
            <AdminUsersTable users={users} />
        </div>
    )
}