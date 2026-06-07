"use client"

import { Button } from "@/components/ui/button"
import { useExportData } from "@/features/account/hooks"

export function ExportDataButton() {
  const { exportData, isExporting } = useExportData()

  return (
    <Button variant="outline" onClick={exportData} disabled={isExporting}>
      {isExporting ? "Preparing…" : "Export my data"}
    </Button>
  )
}
