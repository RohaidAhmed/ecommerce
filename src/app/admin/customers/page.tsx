// app/admin/customers/page.tsx

import { getAdminCustomers } from '@/lib/queries/admin'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers — Admin' }

export default async function AdminCustomersPage() {
    const customers = await getAdminCustomers()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <p className="text-sm text-[#737373] mt-0.5">{customers.length} total</p>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                            <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider">Customer</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider hidden sm:table-cell">Role</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#737373] text-xs uppercase tracking-wider hidden md:table-cell">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f5]">
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-12 text-center text-sm text-[#737373]">
                                    No customers yet.
                                </td>
                            </tr>
                        )}
                        {customers.map((c) => (
                            <tr key={c.id} className="hover:bg-[#fafafa] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {(c.full_name ?? 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{c.full_name ?? 'Unknown'}</p>
                                            <p className="text-xs text-[#737373] font-mono">{c.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span className={cn(
                                        'text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                                        c.role === 'admin'
                                            ? 'bg-[#f5f3ff] text-[#7c3aed]'
                                            : 'bg-[#f5f5f5] text-[#737373]'
                                    )}>
                                        {c.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-[#737373] hidden md:table-cell">
                                    {new Date(c.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}