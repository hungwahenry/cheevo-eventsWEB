"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useEngagement } from "@/features/admin/analytics/hooks"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"

const CONFIG = {
  comments: { label: "Comments", color: "var(--chart-1, var(--primary))" },
  rsvps: { label: "RSVPs", color: "var(--chart-2, hsl(220 70% 50%))" },
  subscriptions: {
    label: "Subscriptions",
    color: "var(--chart-3, hsl(160 60% 45%))",
  },
}

export function EngagementChart() {
  const { data, isLoading } = useEngagement(30)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement (last 30d)</CardTitle>
        <p className="text-muted-foreground text-xs">
          Comments, RSVPs, and subscriptions per day.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="aspect-[4/1] w-full" />
        ) : (
          <ChartContainer config={CONFIG} className="aspect-[4/1] w-full">
            <BarChart
              data={data.series}
              margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
            >
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
                width={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      new Date(String(label)).toLocaleDateString()
                    }
                  />
                }
              />
              <Legend />
              <Bar dataKey="comments" stackId="a" fill={CONFIG.comments.color} />
              <Bar dataKey="rsvps" stackId="a" fill={CONFIG.rsvps.color} />
              <Bar
                dataKey="subscriptions"
                stackId="a"
                fill={CONFIG.subscriptions.color}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
