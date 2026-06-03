import { PaymentDetail } from "@/features/admin/payments/components/payment-detail"

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PaymentDetail id={id} />
}
