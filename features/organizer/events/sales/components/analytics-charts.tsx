"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventAnalytics } from "@/features/organizer/events/sales/hooks"
import type {
  AnalyticsSeriesPoint,
  AnalyticsTopCity,
} from "@/features/organizer/events/sales/types"
import { formatMoney } from "@/lib/format/money"
import { MapPinIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

const TICK_OPTS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
}

function formatX(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, TICK_OPTS)
}

export function AnalyticsCharts({ eventId }: { eventId: string }) {
  const { data, isLoading } = useEventAnalytics(eventId)

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="aspect-[4/1] w-full rounded-xl" />
        <Skeleton className="aspect-[4/1] w-full rounded-xl" />
      </div>
    )
  }

  if (data.cumulative_series.length === 0) {
    return (
      <section className="rounded-xl bg-card p-5">
        <h3 className="mb-2 text-sm font-semibold">Analytics</h3>
        <p className="text-muted-foreground text-sm">
          Charts and audience insights show up once you make your first sale.
        </p>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <CumulativeChart
        series={data.cumulative_series}
        currency={data.currency}
      />
      <DailyChart series={data.daily_series} currency={data.currency} />
      <TopCities cities={data.top_cities} />
    </div>
  )
}

function CumulativeChart({
  series,
  currency,
}: {
  series: AnalyticsSeriesPoint[]
  currency: string
}) {
  return (
    <section className="rounded-xl bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Cumulative sales</h3>
        <p className="text-muted-foreground text-xs">
          Total revenue trending up from the first sale.
        </p>
      </div>
      <ChartContainer
        config={{
          revenue_minor: { label: "Revenue", color: "var(--primary)" },
        }}
        className="aspect-[4/1] max-h-[200px] w-full">
        <AreaChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="fill-cumulative" x1="0" y1="0" x2="0" y2="1">
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
            width={60}
            tickFormatter={(v) =>
              formatMoney(Number(v), currency).replace(/\.\d+$/, "")
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatX(String(label))}
                formatter={(value) => formatMoney(Number(value), currency)}
              />
            }
          />
          <Area
            dataKey="revenue_minor"
            type="monotone"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#fill-cumulative)"
          />
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

function DailyChart({
  series,
  currency,
}: {
  series: AnalyticsSeriesPoint[]
  currency: string
}) {
  return (
    <section className="rounded-xl bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Daily sales</h3>
        <p className="text-muted-foreground text-xs">
          Revenue per day. Spikes are usually a promo or share post landing.
        </p>
      </div>
      <ChartContainer
        config={{
          revenue_minor: { label: "Revenue", color: "var(--primary)" },
        }}
        className="aspect-[4/1] max-h-[200px] w-full">
        <BarChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
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
            width={60}
            tickFormatter={(v) =>
              formatMoney(Number(v), currency).replace(/\.\d+$/, "")
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatX(String(label))}
                formatter={(value) => formatMoney(Number(value), currency)}
              />
            }
          />
          <Bar dataKey="revenue_minor" fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}

function TopCities({ cities }: { cities: AnalyticsTopCity[] }) {
  if (cities.length === 0) {
    return null
  }

  const max = cities[0].buyers_count

  return (
    <section className="rounded-xl bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Top buyer cities</h3>
        <p className="text-muted-foreground text-xs">
          Where your ticket buyers are based.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {cities.map((row) => {
          const sharePct = Math.round((row.buyers_count / max) * 100)
          return (
            <li key={row.city} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="text-muted-foreground size-3.5" />
                  <span className="text-sm font-medium">{row.city}</span>
                </div>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {row.buyers_count.toLocaleString()} buyer
                  {row.buyers_count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${sharePct}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
