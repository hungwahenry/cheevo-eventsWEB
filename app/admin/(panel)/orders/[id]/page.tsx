import { OrderDetail } from "@/features/admin/orders/components/order-detail"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OrderDetail id={id} />
}
