import { Badge } from "@/components/ui/badge"
import type { AdminReportStatus } from "@/features/admin/reports/types"

const LABELS: Record<AdminReportStatus, string> = {
  open: "Open",
  under_review: "Under review",
  actioned: "Actioned",
  dismissed: "Dismissed",
}

const VARIANTS: Record<
  AdminReportStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "default",
  under_review: "secondary",
  actioned: "destructive",
  dismissed: "outline",
}

export function ReportStatusBadge({ status }: { status: AdminReportStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
}
