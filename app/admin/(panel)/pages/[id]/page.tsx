import { PageEditor } from "@/features/admin/pages/components/page-editor"

export default async function AdminPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PageEditor id={id} />
}
