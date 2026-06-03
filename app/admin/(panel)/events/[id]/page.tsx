import { EventDetail } from "@/features/admin/events/components/event-detail"

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EventDetail id={id} />
}
