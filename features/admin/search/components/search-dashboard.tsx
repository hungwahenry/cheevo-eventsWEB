"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  useReindexSearch,
  useSearchHealth,
} from "@/features/admin/search/hooks"
import { RefreshCwIcon } from "lucide-react"
import { useState } from "react"

export function SearchDashboard() {
  const { data, isLoading } = useSearchHealth()
  const reindex = useReindexSearch()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const isRunning = data.last_reindex?.state === "running"

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Index coverage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <CoverageRow
            label="Events"
            indexed={data.indexed.event}
            source={data.source.events}
          />
          <CoverageRow
            label="Organisations"
            indexed={data.indexed.organisation}
            source={data.source.organisations}
          />
          <CoverageRow
            label="Users"
            indexed={data.indexed.user}
            source={data.source.users}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reindex</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          {data.last_reindex ? (
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  Last status
                </span>
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {data.last_reindex.state}
                </Badge>
              </div>
              {data.last_reindex.finished_at ? (
                <p className="text-muted-foreground text-xs">
                  Finished{" "}
                  {new Date(data.last_reindex.finished_at).toLocaleString()}
                </p>
              ) : data.last_reindex.started_at ? (
                <p className="text-muted-foreground text-xs">
                  Running since{" "}
                  {new Date(data.last_reindex.started_at).toLocaleString()}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              No prior reindex recorded.
            </p>
          )}

          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={isRunning || reindex.isPending}
          >
            <RefreshCwIcon className="size-4" />{" "}
            {isRunning ? "Reindex running…" : "Trigger full reindex"}
          </Button>
          <p className="text-muted-foreground text-xs">
            Wipes and rebuilds the search index. Existing search continues to
            work during the rebuild.
          </p>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Trigger a full search reindex?"
        description="Truncates and rebuilds every event, org, and user entry. Safe to run, but takes a few minutes on large datasets."
        confirmLabel="Reindex"
        isSubmitting={reindex.isPending}
        onConfirm={() =>
          reindex.mutate(undefined, {
            onSuccess: () => setConfirmOpen(false),
          })
        }
      />
    </div>
  )
}

function CoverageRow({
  label,
  indexed,
  source,
}: {
  label: string
  indexed: number
  source: number
}) {
  const missing = Math.max(0, source - indexed)
  const drift = source > 0 ? indexed / source : 1
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-xs">
          {indexed.toLocaleString()} / {source.toLocaleString()}
        </span>
      </div>
      {missing > 0 ? (
        <p className="text-destructive text-xs">
          {missing.toLocaleString()} missing ({Math.round((1 - drift) * 100)}%)
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">In sync</p>
      )}
    </div>
  )
}
