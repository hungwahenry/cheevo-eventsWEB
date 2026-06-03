import type {
  AnalyticsInterval,
  AnalyticsOverview,
  EngagementSeries,
  PaymentsAnalytics,
  RevenueSeries,
} from "@/features/admin/analytics/types"
import { api } from "@/lib/api"

export function getOverview(): Promise<AnalyticsOverview> {
  return api.get<AnalyticsOverview>("/admin/analytics/overview")
}

export function getRevenue(
  interval: AnalyticsInterval = "day",
  days = 30
): Promise<RevenueSeries> {
  return api.get<RevenueSeries>("/admin/analytics/revenue", {
    params: { interval, days },
  })
}

export function getPaymentsAnalytics(days = 30): Promise<PaymentsAnalytics> {
  return api.get<PaymentsAnalytics>("/admin/analytics/payments", {
    params: { days },
  })
}

export function getEngagement(days = 30): Promise<EngagementSeries> {
  return api.get<EngagementSeries>("/admin/analytics/engagement", {
    params: { days },
  })
}
