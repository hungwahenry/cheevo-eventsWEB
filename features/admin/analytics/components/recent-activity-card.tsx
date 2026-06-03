"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuditLog } from "@/features/admin/audit-log/hooks"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

export function RecentActivityCard() {
  const { data, isLoading } = useAuditLog({ per_page: 8 })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Recent admin activity</span>
          <Link
            href="/admin/audit-log"
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            View all
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {isLoading || !data ? (
          <Skeleton className="h-48 w-full" />
        ) : data.items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No admin activity yet.</p>
        ) : (
          data.items.map((entry) => (
            <Link
              key={entry.id}
              href={`/admin/audit-log`}
              className="hover:bg-muted -mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-1.5 transition"
            >
              <div className="grid min-w-0 gap-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {entry.action}
                  </Badge>
                  {entry.admin ? (
                    <span className="text-muted-foreground line-clamp-1 text-xs">
                      {entry.admin.username
                        ? `@${entry.admin.username}`
                        : entry.admin.email}
                    </span>
                  ) : null}
                </div>
                {entry.reason ? (
                  <span className="text-muted-foreground line-clamp-1 text-xs">
                    {entry.reason}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <span className="text-muted-foreground text-xs">
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
                <ChevronRightIcon className="text-muted-foreground size-4" />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
