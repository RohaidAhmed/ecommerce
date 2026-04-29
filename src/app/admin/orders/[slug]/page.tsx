import AdminOrdersItemTable from "@/components/admin/AdminOrdersItemTable";
import { adminGetCustomerByOrderId, adminGetOrderById } from "@/lib/queries/admin";


export async function generateMetadata({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    return { title: `Order #${resolvedParams.slug} — Admin` }
}

export default async function OrderDetailsPage({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    const orderDetails = await adminGetOrderById(resolvedParams.slug)
    const customer = await adminGetCustomerByOrderId(resolvedParams.slug)
    const paymentInfo = orderDetails.data?.stripe_payment_intent_id ?? 'Cash on Delivery';
    const orderStatus = orderDetails.data?.status.toLocaleUpperCase();

    if (!orderDetails) {
        throw new Error('Order not found')
    }

    if (orderDetails.error) {
        throw new Error(orderDetails.error)
    }
    return (
        <div>
            <h1 className="font-display text-2xl font-bold">Order Details</h1>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">View and manage the details of this order.</p>
                {/* Order details content goes here */}
                <div className="mt-6">
                    <h2 className="font-semibold text-lg">Order Items</h2>
                    <AdminOrdersItemTable items={orderDetails.data?.items} />
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-lg">Customer Information</h2>
                    <p className="text-sm text-[var(--color-muted)]">{customer.data?.full_name}</p>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-lg">Shipping Address</h2>
                    <p className="text-sm text-[var(--color-muted)]">{orderDetails?.data?.shipping_address?.line1}</p>
                    <p className="text-sm text-[var(--color-muted)]">{orderDetails?.data?.shipping_address?.line2}</p>
                    <p className="text-sm text-[var(--color-muted)]">{orderDetails?.data?.shipping_address?.city}</p>
                    <p className="text-sm text-[var(--color-muted)]">{orderDetails?.data?.shipping_address?.postal_code}</p>
                    <p className="text-sm text-[var(--color-muted)]">{orderDetails?.data?.shipping_address?.country}</p>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-lg">Payment Information</h2>
                    <p className="text-sm text-[var(--color-muted)]">Payment Method: {paymentInfo}</p>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-lg">Order Status</h2>
                    <p className="text-sm text-[var(--color-muted)]">{orderStatus}</p>
                </div>

        </div>
    )
}