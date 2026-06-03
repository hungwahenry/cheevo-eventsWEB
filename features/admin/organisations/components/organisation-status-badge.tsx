import { Badge } from "@/components/ui/badge"
import type { AdminOrganisation } from "@/features/admin/organisations/types"

export function OrganisationStatusBadge({
  organisation,
}: {
  organisation: Pick<AdminOrganisation, "suspended_at">
}) {
  return organisation.suspended_at ? (
    <Badge variant="destructive">Suspended</Badge>
  ) : (
    <Badge variant="secondary">Active</Badge>
  )
}
