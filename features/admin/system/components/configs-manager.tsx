"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfigRow } from "@/features/admin/system/components/config-row"
import { useSystemConfigs } from "@/features/admin/system/hooks"
import type { AdminSystemConfig } from "@/features/admin/system/types"
import { SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"

export function ConfigsManager() {
  const { data, isLoading } = useSystemConfigs()
  const [q, setQ] = useState("")

  const grouped = useMemo(() => {
    if (!data) return new Map<string, AdminSystemConfig[]>()
    const filtered = q.trim()
      ? data.filter(
          (c) =>
            c.key.toLowerCase().includes(q.toLowerCase()) ||
            c.description?.toLowerCase().includes(q.toLowerCase())
        )
      : data
    const map = new Map<string, AdminSystemConfig[]>()
    for (const config of filtered) {
      const bucket = map.get(config.group) ?? []
      bucket.push(config)
      map.set(config.group, bucket)
    }
    return map
  }, [data, q])

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by key or description…"
          className="pl-9"
        />
      </div>
      {Array.from(grouped.entries()).map(([group, configs]) => (
        <Card key={group}>
          <CardContent className="p-0">
            <div className="bg-muted/50 border-b px-4 py-2">
              <h3 className="text-sm font-semibold capitalize">{group}</h3>
            </div>
            <div className="divide-y">
              {configs.map((config) => (
                <ConfigRow key={config.id} config={config} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      {grouped.size === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No configs match.
        </p>
      ) : null}
    </div>
  )
}
