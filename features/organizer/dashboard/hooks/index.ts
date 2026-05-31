import { getDashboard } from "@/features/organizer/dashboard/api"
import type { DashboardRange } from "@/features/organizer/dashboard/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const dashboardKey = (orgId: string, range: DashboardRange) =>
  ["organizer-dashboard", orgId, range] as const

export function useDashboard(orgId: string, range: DashboardRange) {
  return useQuery({
    queryKey: dashboardKey(orgId, range),
    queryFn: () => getDashboard(orgId, range),
    placeholderData: keepPreviousData,
  })
}
