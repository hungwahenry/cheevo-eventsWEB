import type {
  DashboardRange,
  DashboardSummary,
} from "@/features/organizer/dashboard/types"
import { api } from "@/lib/api"

export function getDashboard(
  orgId: string,
  range: DashboardRange
): Promise<DashboardSummary> {
  return api.get<DashboardSummary>(
    `/organizer/organisations/${orgId}/dashboard`,
    { params: { range } }
  )
}
