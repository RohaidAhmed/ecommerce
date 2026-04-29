'use client'
import { useTransition } from 'react'
import { adminToggleUserRole } from '@/lib/actions/admin.actions'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface AdminUsersTableProps { users: Profile[] }

export function AdminUsersTable({ users }: AdminUsersTableProps) {
    const [isPending, startTransition] = useTransition()

    function handleToggleRole(userId: string, role: string) {
        startTransition(() => adminToggleUserRole(userId, role))
    }

    return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                    <tr>
                        {['User ID', 'Name', 'Role', 'Joined', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">
                                {user.id.slice(0, 8)}…
                            </td>
                            <td className="px-4 py-3 font-medium">
                                {user.full_name ?? <span className="text-[var(--color-muted)] italic">No name</span>}
                            </td>
                            <td className="px-4 py-3">
                                <span className={cn(
                                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    user.role === 'admin'
                                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                                        : 'bg-[var(--color-surface-2)] text-[var(--color-muted-fg)] border border-[var(--color-border)]'
                                )}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-[var(--color-muted-fg)] whitespace-nowrap">
                                {new Date(user.created_at).toLocaleDateString('en-PK', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                })}
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => handleToggleRole(user.id, user.role)}
                                    disabled={isPending}
                                    className="text-xs text-[var(--color-muted-fg)] hover:text-[var(--color-primary)] underline underline-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}