"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOverview } from "@/features/admin/analytics/hooks"
import { formatMoney } from "@/lib/format/money"

export function OverviewCard() {
  const { data, isLoading } = useOverview()

  if (isLoading || !data) {
    return <Skeleton className="h-48 w-full" />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            GMV
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {formatMoney(data.gmv.total_minor, data.gmv.currency)}
          </span>
          <span className="text-muted-foreground text-xs">
            Last 30d:{" "}
            {formatMoney(data.gmv.last_30d_minor, data.gmv.currency)}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {data.users.total.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">
            +{data.users.new_30d} in 30d · {data.users.organisers} organisers
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Events
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {data.events.total.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">
            {data.events.published} published · {data.events.past} past
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {data.orders.total.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">
            {data.orders.paid} paid · {data.orders.refunded} refunded ·{" "}
            {data.orders.pending} pending
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
