"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  useAllowedCommands,
  useOpsHealth,
  useQueueStats,
  useRunCommand,
} from "@/features/admin/ops/hooks"
import type { RunCommandResult } from "@/features/admin/ops/types"
import { PlayIcon } from "lucide-react"
import { useState } from "react"

export function OpsDashboard() {
  const health = useOpsHealth()
  const queue = useQueueStats()
  const commands = useAllowedCommands()
  const run = useRunCommand()
  const [selected, setSelected] = useState<string>("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState<RunCommandResult | null>(null)

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {health.isLoading || !health.data ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <ProbeRow
                  label="Database"
                  meta={health.data.db.connection}
                  healthy={health.data.db.healthy}
                />
                <ProbeRow
                  label="Cache"
                  meta={health.data.cache.store}
                  healthy={health.data.cache.healthy}
                />
                <ProbeRow
                  label="Storage"
                  meta={health.data.storage.disk}
                  healthy={health.data.storage.healthy}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Queue</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {queue.isLoading || !queue.data ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Pending" value={queue.data.pending} />
                  <Stat
                    label="Failed"
                    value={queue.data.failed}
                    tone={queue.data.failed > 0 ? "destructive" : undefined}
                  />
                </div>
                {Object.keys(queue.data.by_queue).length > 0 ? (
                  <div className="grid gap-1">
                    <span className="text-muted-foreground text-xs">
                      By queue
                    </span>
                    {Object.entries(queue.data.by_queue).map(([q, n]) => (
                      <div
                        key={q}
                        className="flex items-center justify-between"
                      >
                        <span className="font-mono text-xs">{q}</span>
                        <span className="tabular-nums text-xs">{n}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {health.data?.queue.oldest_pending_seconds &&
                health.data.queue.oldest_pending_seconds > 60 ? (
                  <p className="text-destructive text-xs">
                    Oldest pending job is{" "}
                    {Math.round(
                      health.data.queue.oldest_pending_seconds / 60
                    )}{" "}
                    min old — worker may be down.
                  </p>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Run a command</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex gap-2">
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Pick an allow-listed command…" />
              </SelectTrigger>
              <SelectContent>
                {commands.data?.commands.map((c) => (
                  <SelectItem key={c} value={c} className="font-mono">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={!selected || run.isPending}
            >
              <PlayIcon className="size-4" /> Run
            </Button>
          </div>
          {lastResult ? (
            <div className="grid gap-2 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{lastResult.command}</span>
                <Badge
                  variant={lastResult.exit_code === 0 ? "default" : "destructive"}
                >
                  exit {lastResult.exit_code}
                </Badge>
              </div>
              {lastResult.output ? (
                <pre className="bg-muted max-h-48 overflow-auto rounded-md p-2 font-mono text-xs">
                  {lastResult.output}
                </pre>
              ) : (
                <p className="text-muted-foreground text-xs">No output.</p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Run "${selected}"?`}
        description="The command runs synchronously on the API server."
        confirmLabel="Run"
        isSubmitting={run.isPending}
        onConfirm={() => {
          if (!selected) return
          run.mutate(selected, {
            onSuccess: (result) => {
              setLastResult(result)
              setConfirmOpen(false)
            },
          })
        }}
      />
    </div>
  )
}

function ProbeRow({
  label,
  meta,
  healthy,
}: {
  label: string
  meta: string
  healthy: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-0.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground font-mono text-xs">{meta}</span>
      </div>
      <Badge variant={healthy ? "default" : "destructive"}>
        {healthy ? "OK" : "Down"}
      </Badge>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "destructive"
}) {
  return (
    <div className="grid gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span
        className={
          "tabular-nums text-xl font-semibold " +
          (tone === "destructive" ? "text-destructive" : "")
        }
      >
        {value}
      </span>
    </div>
  )
}
