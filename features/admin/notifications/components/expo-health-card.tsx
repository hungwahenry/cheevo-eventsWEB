"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useExpoTokenHealth } from "@/features/admin/notifications/hooks"

export function ExpoHealthCard() {
  const { data, isLoading } = useExpoTokenHealth()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Expo push tokens</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        {isLoading || !data ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total" value={data.total} />
            <Stat label="Active 7d" value={data.active_last_7d} />
            <Stat label="Active 30d" value={data.active_last_30d} />
            <Stat label="Stale" value={data.stale} tone="muted" />
          </div>
        )}
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
  value: number
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
