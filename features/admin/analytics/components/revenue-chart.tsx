"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useRevenue } from "@/features/admin/analytics/hooks"
import type { AnalyticsInterval } from "@/features/admin/analytics/types"
import { formatMoney } from "@/lib/format/money"
import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

export function RevenueChart() {
  const [interval, setInterval] = useState<AnalyticsInterval>("day")
  const days = interval === "month" ? 365 : interval === "week" ? 90 : 30
  const { data, isLoading } = useRevenue(interval, days)

  const config = {
    gmv_minor: { label: "GMV", color: "var(--primary)" },
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="grid gap-1">
          <CardTitle className="text-base">Revenue</CardTitle>
          <p className="text-muted-foreground text-xs">
            Paid orders only.
          </p>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          value={interval}
          onValueChange={(v) => v && setInterval(v as AnalyticsInterval)}
        >
          <ToggleGroupItem value="day">Daily</ToggleGroupItem>
          <ToggleGroupItem value="week">Weekly</ToggleGroupItem>
          <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="aspect-[4/1] w-full" />
        ) : (
          <ChartContainer config={config} className="aspect-[4/1] w-full">
            <AreaChart
              data={data.series}
              margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fill-gmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={60}
                tickFormatter={(v) =>
                  formatMoney(Number(v), data.currency).replace(/\.\d+$/, "")
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      new Date(String(label)).toLocaleDateString()
                    }
                    formatter={(value) =>
                      formatMoney(Number(value), data.currency)
                    }
                  />
                }
              />
              <Area
                dataKey="gmv_minor"
                type="monotone"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#fill-gmv)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
