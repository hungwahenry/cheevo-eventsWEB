"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import type {
  NotificationAudienceKey,
  NotificationTypeOption,
} from "@/features/notifications/api"
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from "@/features/notifications/hooks"

type Props = { audience: NotificationAudienceKey }

export function NotificationPreferencesTable({ audience }: Props) {
  const { data, isLoading } = useNotificationPreferences()
  const update = useUpdateNotificationPreference()

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  const types = data.types.filter((t) => t.audience === audience)

  if (types.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No notifications yet for this surface.
      </p>
    )
  }

  return (
    <div className="flex flex-col divide-y rounded-xl border">
      {types.map((type) => (
        <PreferenceRow
          key={type.type}
          type={type}
          onToggle={(channel, enabled) =>
            update.mutate({ type: type.type, channel, enabled })
          }
        />
      ))}
    </div>
  )
}

function PreferenceRow({
  type,
  onToggle,
}: {
  type: NotificationTypeOption
  onToggle: (
    channel: NotificationTypeOption["channels"][number]["channel"],
    enabled: boolean
  ) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{type.label}</p>
        <p className="text-muted-foreground text-xs">{type.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {type.channels.map((channel) => (
          <label
            key={channel.channel}
            className="flex items-center gap-2 text-xs font-medium"
          >
            <Switch
              checked={channel.enabled}
              onCheckedChange={(value) => onToggle(channel.channel, value)}
            />
            {channel.label}
          </label>
        ))}
      </div>
    </div>
  )
}
