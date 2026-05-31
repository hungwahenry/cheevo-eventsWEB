"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { DashboardRange } from "@/features/organizer/dashboard/types"

const OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "12mo", label: "12mo" },
]

type Props = {
  value: DashboardRange
  onChange: (range: DashboardRange) => void
}

export function RangeSelector({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as DashboardRange)}
      variant="outline"
      size="sm">
      {OPTIONS.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
