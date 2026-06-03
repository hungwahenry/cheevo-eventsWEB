"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOverview } from "@/features/admin/analytics/hooks"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

export function ActionItemsCard() {
  const { data, isLoading } = useOverview()

  if (isLoading || !data) {
    return <Skeleton className="h-56 w-full" />
  }

  const items = [
    {
      label: "Open reports",
      value: data.action_items.open_reports,
      href: "/admin/reports",
    },
    {
      label: "Payouts to review",
      value: data.action_items.pending_payouts,
      href: "/admin/payouts",
    },
    {
      label: "Failed payouts",
      value: data.action_items.failed_payouts,
      href: "/admin/payouts",
      destructive: true,
    },
    {
      label: "Failed jobs",
      value: data.action_items.failed_jobs,
      href: "/admin/ops",
      destructive: true,
    },
  ]
  const totalOutstanding = items.reduce((acc, i) => acc + i.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Needs attention</span>
          {totalOutstanding === 0 ? (
            <Badge variant="default">All clear</Badge>
          ) : (
            <Badge variant="destructive">{totalOutstanding}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="hover:bg-muted -mx-2 flex items-center justify-between rounded-md px-2 py-2 transition"
          >
            <span className="text-sm">{item.label}</span>
            <div className="flex items-center gap-1">
              <span
                className={
                  "tabular-nums text-sm font-semibold " +
                  (item.value === 0
                    ? "text-muted-foreground"
                    : item.destructive
                      ? "text-destructive"
                      : "")
                }
              >
                {item.value}
              </span>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
