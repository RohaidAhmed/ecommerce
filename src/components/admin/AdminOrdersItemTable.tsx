import { OrderItem } from "@/types";

export default function AdminOrdersItemTable({ items }: { items?: OrderItem[] }) {
    return (
        <div
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
            style={{ width: "100%", maxWidth: "100%" }}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                        <tr>
                            {['Image', "Product", "Unit price", "Quantity", "Line total"].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {items?.map((item) => {
                            const lineTotal = item.unit_price * item.quantity;
                            return (
                                <tr key={item.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                                    <td className="px-4 py-3 text-xs font-medium">
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover" />
                                        ) : (
                                            <div className="bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-md w-16 h-16 flex items-center justify-center">
                                                <span className="text-[var(--color-muted)] text-xs">No Image</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-medium">
                                        {item.product?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-muted-fg)]">${item.unit_price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-[var(--color-muted-fg)] text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                                        ${lineTotal.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};