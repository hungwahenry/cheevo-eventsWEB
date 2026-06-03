import { OrganisationDetail } from "@/features/admin/organisations/components/organisation-detail"

export default async function AdminOrganisationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OrganisationDetail id={id} />
}
