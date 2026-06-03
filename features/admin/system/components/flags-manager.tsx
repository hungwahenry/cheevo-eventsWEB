"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  useFeatureFlags,
  useUpdateFeatureFlag,
} from "@/features/admin/system/hooks"
import type { AdminFeatureFlag } from "@/features/admin/system/types"
import { useState } from "react"

export function FlagsManager() {
  const { data, isLoading } = useFeatureFlags()
  const update = useUpdateFeatureFlag()

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {data.map((flag) => (
            <FlagRow
              key={flag.id}
              flag={flag}
              onUpdate={(payload) =>
                update.mutate({ id: flag.id, payload })
              }
              disabled={update.isPending}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FlagRow({
  flag,
  onUpdate,
  disabled,
}: {
  flag: AdminFeatureFlag
  onUpdate: (payload: { enabled?: boolean; rollout_pct?: number }) => void
  disabled?: boolean
}) {
  const [localRollout, setLocalRollout] = useState(flag.rollout_pct)

  return (
    <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,160px)] md:items-center">
      <div className="grid gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{flag.key}</span>
          {flag.is_public ? (
            <Badge variant="outline" className="text-xs">
              public
            </Badge>
          ) : null}
        </div>
        {flag.description ? (
          <p className="text-muted-foreground text-xs">{flag.description}</p>
        ) : null}
      </div>

      <Switch
        checked={flag.enabled}
        onCheckedChange={(checked) => onUpdate({ enabled: checked })}
        disabled={disabled}
      />

      <div className="grid gap-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Rollout</span>
          <span className="tabular-nums text-xs font-medium">
            {localRollout}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={localRollout}
          onChange={(e) => setLocalRollout(Number(e.target.value))}
          onMouseUp={() =>
            localRollout !== flag.rollout_pct &&
            onUpdate({ rollout_pct: localRollout })
          }
          onTouchEnd={() =>
            localRollout !== flag.rollout_pct &&
            onUpdate({ rollout_pct: localRollout })
          }
          disabled={disabled || !flag.enabled}
          className="w-full"
        />
      </div>
    </div>
  )
}
