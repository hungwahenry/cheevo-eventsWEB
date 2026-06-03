import { PayoutDetail } from "@/features/admin/payouts/components/payout-detail"

export default async function AdminPayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PayoutDetail id={id} />
}
