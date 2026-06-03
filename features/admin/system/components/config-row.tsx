"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  useResetSystemConfig,
  useUpdateSystemConfig,
} from "@/features/admin/system/hooks"
import type { AdminSystemConfig } from "@/features/admin/system/types"
import { RotateCcwIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function ConfigRow({ config }: { config: AdminSystemConfig }) {
  const update = useUpdateSystemConfig()
  const reset = useResetSystemConfig()
  const [draft, setDraft] = useState<string>(() => stringify(config.value))

  useEffect(() => {
    setDraft(stringify(config.value))
  }, [config.value])

  const trimmed = draft.trim()
  const isDirtyFromCurrent =
    stringify(config.value) !== trimmed && trimmed.length > 0

  const submit = () => {
    if (!isDirtyFromCurrent) return
    const parsed = parse(trimmed, config.type)
    if (parsed === undefined) return
    update.mutate({ id: config.id, payload: { value: parsed } })
  }

  return (
    <div className="grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-center">
      <div className="grid gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium truncate">
            {config.key}
          </span>
          <Badge variant="outline" className="text-xs">
            {config.type}
          </Badge>
          {config.is_public ? (
            <Badge variant="secondary" className="text-xs">
              public
            </Badge>
          ) : null}
          {config.is_dirty ? (
            <Badge variant="default" className="text-xs">
              modified
            </Badge>
          ) : null}
        </div>
        {config.description ? (
          <p className="text-muted-foreground text-xs line-clamp-2">
            {config.description}
          </p>
        ) : null}
        <p className="text-muted-foreground font-mono text-xs">
          default: {stringify(config.default_value)}
        </p>
      </div>

      {config.type === "bool" ? (
        <Switch
          checked={config.value === true}
          onCheckedChange={(checked) =>
            update.mutate({ id: config.id, payload: { value: checked } })
          }
          disabled={update.isPending}
        />
      ) : (
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur()
            }
          }}
          inputMode={
            config.type === "int" || config.type === "decimal"
              ? "decimal"
              : "text"
          }
          className="font-mono text-xs"
          disabled={update.isPending}
        />
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() => reset.mutate(config.id)}
        disabled={!config.is_dirty || reset.isPending}
        title="Reset to default"
      >
        <RotateCcwIcon className="size-4" />
      </Button>
    </div>
  )
}

function stringify(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function parse(raw: string, type: AdminSystemConfig["type"]): unknown {
  switch (type) {
    case "int": {
      const n = Number(raw)
      return Number.isInteger(n) ? n : undefined
    }
    case "decimal": {
      const n = Number(raw)
      return Number.isFinite(n) ? n : undefined
    }
    case "bool":
      return raw === "true" || raw === "1"
    case "json":
      try {
        return JSON.parse(raw)
      } catch {
        return undefined
      }
    case "string":
    default:
      return raw
  }
}
