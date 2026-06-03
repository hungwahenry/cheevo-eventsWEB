import { ActionItemsCard } from "@/features/admin/analytics/components/action-items-card"
import { EngagementChart } from "@/features/admin/analytics/components/engagement-chart"
import { OverviewCard } from "@/features/admin/analytics/components/overview-card"
import { PaymentsCard } from "@/features/admin/analytics/components/payments-card"
import { RecentActivityCard } from "@/features/admin/analytics/components/recent-activity-card"
import { RevenueChart } from "@/features/admin/analytics/components/revenue-chart"

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Everything at a glance — GMV, growth, attention items, recent activity.
        </p>
      </div>

      <OverviewCard />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RevenueChart />
        <ActionItemsCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PaymentsCard />
        <EngagementChart />
      </div>

      <RecentActivityCard />
    </div>
  )
}
