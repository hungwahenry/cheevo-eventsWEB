"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  DashboardRange,
  KpiMetric,
  TimeseriesPoint,
} from "@/features/organizer/dashboard/types"
import { formatMoney } from "@/lib/format/money"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const TICK_OPTS_BY_RANGE: Record<DashboardRange, Intl.DateTimeFormatOptions> = {
  "7d": { weekday: "short" },
  "30d": { month: "short", day: "numeric" },
  "90d": { month: "short", day: "numeric" },
  "12mo": { month: "short", year: "2-digit" },
}

type Props = {
  title: string
  metric: KpiMetric
  data?: TimeseriesPoint[]
  range: DashboardRange
  currency: string
  isLoading?: boolean
}

export function MetricChart({
  title,
  metric,
  data,
  range,
  currency,
  isLoading,
}: Props) {
  if (isLoading || !data) {
    return (
      <section className="bg-card rounded-xl p-5">
        <h3 className="mb-4 text-sm font-semibold">{title}</h3>
        <Skeleton className="aspect-[4/1] w-full" />
      </section>
    )
  }

  const isMoney = metric === "revenue_minor"
  const tickOpts = TICK_OPTS_BY_RANGE[range]

  const formatX = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, tickOpts)

  const formatY = (value: number) =>
    isMoney
      ? formatMoney(value, currency)
      : Number(value).toLocaleString()

  const config = {
    [metric]: {
      label: title,
      color: "var(--primary)",
    },
  }

  return (
    <section className="bg-card rounded-xl p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <ChartContainer
        config={config}
        className="aspect-[4/1] max-h-[180px] w-full">
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={formatX}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={isMoney ? 60 : 32}
            tickFormatter={(v) =>
              isMoney
                ? formatMoney(Number(v), currency).replace(/\.\d+$/, "")
                : Number(v).toLocaleString()
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatX(String(label))}
                formatter={(value) => formatY(Number(value))}
              />
            }
          />
          <Area
            dataKey={metric}
            type="monotone"
            stroke="var(--primary)"
            strokeWidth={2}
            fill={`url(#fill-${metric})`}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  )
}
