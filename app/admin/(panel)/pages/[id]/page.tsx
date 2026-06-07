import { PageForm } from "@/features/admin/pages/components/page-form"

export default async function AdminPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PageForm mode="edit" id={id} />
}
