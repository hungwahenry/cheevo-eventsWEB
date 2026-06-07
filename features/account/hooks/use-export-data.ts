import { getDataExport } from "@/features/account/api"
import { useState } from "react"
import { toast } from "sonner"

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      const payload = await getDataExport()
      const json = JSON.stringify(payload, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = "cheevo-data-export.json"
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      toast.success("Your data export has downloaded.")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not export your data.")
    } finally {
      setIsExporting(false)
    }
  }

  return { exportData, isExporting }
}
