"use client"

import { Switch } from "@/components/ui/switch"

type SettingsBlockProps = {
  title: string
  description: string
  enabled: boolean
  onToggle: (value: boolean) => void
  children: React.ReactNode
}

export function SettingsBlock({
  title,
  description,
  enabled,
  onToggle,
  children,
}: SettingsBlockProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled ? children : null}
    </div>
  )
}
