"use client"

import { ActivityFeed } from "@/features/organizer/dashboard/components/activity-feed"
import { KpiCards } from "@/features/organizer/dashboard/components/kpi-cards"
import { MetricChart } from "@/features/organizer/dashboard/components/metric-chart"
import { NextEventCard } from "@/features/organizer/dashboard/components/next-event-card"
import { RangeSelector } from "@/features/organizer/dashboard/components/range-selector"
import { TopEvents } from "@/features/organizer/dashboard/components/top-events"
import { useDashboard } from "@/features/organizer/dashboard/hooks"
import type { DashboardRange } from "@/features/organizer/dashboard/types"
import { useState } from "react"

type Props = { orgId: string; userFirstName?: string | null }

export function Dashboard({ orgId, userFirstName }: Props) {
  const [range, setRange] = useState<DashboardRange>("30d")
  const { data, isLoading } = useDashboard(orgId, range)

  const currency = data?.currency ?? "NGN"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {userFirstName ? `Welcome, ${userFirstName}` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm">
            How your events are performing.
          </p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      <KpiCards
        kpis={data?.kpis}
        currency={currency}
        isLoading={isLoading}
      />

      <TopEvents
        events={data?.top_events}
        currency={currency}
        isLoading={isLoading}
      />

      <MetricChart
        title="Revenue"
        metric="revenue_minor"
        data={data?.timeseries}
        range={range}
        currency={currency}
        isLoading={isLoading}
      />

      <MetricChart
        title="Tickets sold"
        metric="tickets"
        data={data?.timeseries}
        range={range}
        currency={currency}
        isLoading={isLoading}
      />

      <MetricChart
        title="Orders"
        metric="orders"
        data={data?.timeseries}
        range={range}
        currency={currency}
        isLoading={isLoading}
      />

      <MetricChart
        title="RSVPs"
        metric="rsvps"
        data={data?.timeseries}
        range={range}
        currency={currency}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NextEventCard
          event={data?.next_event ?? null}
          currency={currency}
          isLoading={isLoading}
        />
        <ActivityFeed items={data?.recent_activity} isLoading={isLoading} />
      </div>
    </div>
  )
}
