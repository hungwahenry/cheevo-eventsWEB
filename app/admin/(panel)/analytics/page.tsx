import { EngagementChart } from "@/features/admin/analytics/components/engagement-chart"
import { OverviewCard } from "@/features/admin/analytics/components/overview-card"
import { PaymentsCard } from "@/features/admin/analytics/components/payments-card"
import { RevenueChart } from "@/features/admin/analytics/components/revenue-chart"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          System-wide overview, revenue, payments, and engagement.
        </p>
      </div>
      <OverviewCard />
      <RevenueChart />
      <div className="grid gap-4 lg:grid-cols-2">
        <PaymentsCard />
        <EngagementChart />
      </div>
    </div>
  )
}
