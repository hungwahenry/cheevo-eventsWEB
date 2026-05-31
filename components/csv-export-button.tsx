"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

type Props = {
  href: string
  label?: string
}

export function CsvExportButton({ href, label = "Export CSV" }: Props) {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} download>
        <DownloadIcon className="size-4" />
        {label}
      </a>
    </Button>
  )
}
