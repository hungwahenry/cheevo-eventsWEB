"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaymentsAnalytics } from "@/features/admin/analytics/hooks"

export function PaymentsCard() {
  const { data, isLoading } = usePaymentsAnalytics(30)

  if (isLoading || !data) {
    return <Skeleton className="h-48 w-full" />
  }

  const providers = Object.entries(data.by_provider)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payments (last 30d)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Successful" value={data.totals.successful} />
          <Stat
            label="Failed"
            value={data.totals.failed}
            tone={data.totals.failed > 0 ? "muted" : undefined}
          />
          <Stat
            label="Success rate"
            value={`${Math.round(data.totals.success_rate * 100)}%`}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-muted-foreground text-xs">By provider</span>
          {providers.length === 0 ? (
            <p className="text-muted-foreground text-xs">No data.</p>
          ) : (
            providers.map(([provider, stats]) => (
              <div
                key={provider}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span className="font-medium capitalize">{provider}</span>
                <div className="flex gap-3 text-xs">
                  <span className="tabular-nums">
                    {stats.successful}/{stats.total}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round(stats.success_rate * 100)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone?: "muted"
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span
        className={
          "tabular-nums text-xl font-semibold " +
          (tone === "muted" ? "text-muted-foreground" : "")
        }
      >
        {value}
      </span>
    </div>
  )
}
