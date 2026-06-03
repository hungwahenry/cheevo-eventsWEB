import { OrdersTable } from "@/features/admin/orders/components/orders-table"

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Every order on the platform. Refund, cancel, or manually mark paid.
        </p>
      </div>
      <OrdersTable />
    </div>
  )
}
