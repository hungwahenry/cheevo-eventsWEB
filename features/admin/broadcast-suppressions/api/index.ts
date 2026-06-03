import type {
  AdminBroadcastSuppressionsPage,
  AdminSuppressionReason,
} from "@/features/admin/broadcast-suppressions/types"
import { api } from "@/lib/api"

export type ListSuppressionsFilters = {
  q?: string
  reason?: AdminSuppressionReason
  organisation_id?: string
  per_page?: number
  page?: number
}

export function listSuppressions(
  filters: ListSuppressionsFilters = {}
): Promise<AdminBroadcastSuppressionsPage> {
  return api.get<AdminBroadcastSuppressionsPage>(
    "/admin/broadcast-suppressions",
    { params: filters }
  )
}

export function deleteSuppression(id: string): Promise<void> {
  return api.delete<void>(`/admin/broadcast-suppressions/${id}`)
}
