import { BroadcastDetail } from "@/features/admin/broadcasts/components/broadcast-detail"

export default async function AdminBroadcastDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BroadcastDetail id={id} />
}
