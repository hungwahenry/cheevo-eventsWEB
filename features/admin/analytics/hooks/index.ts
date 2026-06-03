import * as api from "@/features/admin/analytics/api"
import type { AnalyticsInterval } from "@/features/admin/analytics/types"
import { useQuery } from "@tanstack/react-query"

export const overviewKey = () => ["admin", "analytics", "overview"] as const
export const revenueKey = (interval: AnalyticsInterval, days: number) =>
  ["admin", "analytics", "revenue", interval, days] as const
export const paymentsKey = (days: number) =>
  ["admin", "analytics", "payments", days] as const
export const engagementKey = (days: number) =>
  ["admin", "analytics", "engagement", days] as const

export function useOverview() {
  return useQuery({
    queryKey: overviewKey(),
    queryFn: () => api.getOverview(),
    staleTime: 30_000,
  })
}

export function useRevenue(interval: AnalyticsInterval = "day", days = 30) {
  return useQuery({
    queryKey: revenueKey(interval, days),
    queryFn: () => api.getRevenue(interval, days),
    staleTime: 30_000,
  })
}

export function usePaymentsAnalytics(days = 30) {
  return useQuery({
    queryKey: paymentsKey(days),
    queryFn: () => api.getPaymentsAnalytics(days),
    staleTime: 30_000,
  })
}

export function useEngagement(days = 30) {
  return useQuery({
    queryKey: engagementKey(days),
    queryFn: () => api.getEngagement(days),
    staleTime: 30_000,
  })
}
