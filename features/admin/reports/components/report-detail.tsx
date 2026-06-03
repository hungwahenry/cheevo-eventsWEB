"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ReasonDialog } from "@/features/admin/components/reason-dialog"
import { ReportActionDialog } from "@/features/admin/reports/components/report-action-dialog"
import { ReportStatusBadge } from "@/features/admin/reports/components/report-status-badge"
import { shortDate } from "@/features/admin/reports/format"
import {
  useActionReport,
  useDismissReport,
  useReport,
  useStartReview,
} from "@/features/admin/reports/hooks"
import type {
  AdminReport,
  AdminReportTarget,
} from "@/features/admin/reports/types"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ReportDetail({ id }: { id: string }) {
  const { data: report, isLoading } = useReport(id)
  const startReview = useStartReview()
  const actionReport = useActionReport()
  const dismiss = useDismissReport()
  const [actionOpen, setActionOpen] = useState(false)
  const [dismissOpen, setDismissOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!report) {
    return <div className="p-6 text-sm">Report not found.</div>
  }

  const terminal = report.status === "actioned" || report.status === "dismissed"

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/admin/reports"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeftIcon className="size-4" /> Reports
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {report.reason?.label ?? "Report"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {report.target_type} · created {shortDate(report.created_at)}
          </p>
        </div>
        <ReportStatusBadge status={report.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target preview</CardTitle>
            </CardHeader>
            <CardContent>
              <TargetPreview target={report.target ?? null} type={report.target_type} />
            </CardContent>
          </Card>

          {report.details ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reporter note</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">{report.details}</CardContent>
            </Card>
          ) : null}

          {report.resolution_note ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resolution</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {report.resolution_note}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {report.status === "open" ? (
              <Button
                variant="secondary"
                onClick={() => startReview.mutate(report.id)}
                disabled={startReview.isPending}
              >
                Start review
              </Button>
            ) : null}
            <Button
              disabled={terminal || actionReport.isPending}
              onClick={() => setActionOpen(true)}
            >
              Action…
            </Button>
            <Button
              variant="outline"
              disabled={terminal || dismiss.isPending}
              onClick={() => setDismissOpen(true)}
            >
              Dismiss…
            </Button>
            <ReporterCard report={report} />
          </CardContent>
        </Card>
      </div>

      <ReportActionDialog
        open={actionOpen}
        onOpenChange={setActionOpen}
        isSubmitting={actionReport.isPending}
        onConfirm={(input) => {
          actionReport.mutate(
            { id: report.id, input },
            { onSuccess: () => setActionOpen(false) }
          )
        }}
      />

      <ReasonDialog
        open={dismissOpen}
        onOpenChange={setDismissOpen}
        title="Dismiss report"
        description="Closes the report without removing the target."
        confirmLabel="Dismiss"
        isSubmitting={dismiss.isPending}
        onConfirm={(reason) => {
          dismiss.mutate(
            { id: report.id, resolution_note: reason },
            { onSuccess: () => setDismissOpen(false) }
          )
        }}
      />
    </div>
  )
}

function TargetPreview({
  target,
  type,
}: {
  target: AdminReportTarget
  type: string | null
}) {
  if (!target) {
    return (
      <p className="text-muted-foreground text-sm italic">
        Target was removed or is no longer available.
      </p>
    )
  }
  if (type === "event_comment" && "body" in target) {
    return (
      <div className="grid gap-2 text-sm">
        <span className="text-muted-foreground text-xs">
          Comment · {shortDate(target.created_at)}
        </span>
        <p className="whitespace-pre-wrap">{target.body ?? "(no text)"}</p>
      </div>
    )
  }
  return (
    <p className="text-muted-foreground text-sm">ID: {target.id}</p>
  )
}

function ReporterCard({ report }: { report: AdminReport }) {
  if (!report.reporter) return null
  return (
    <div className="mt-2 border-t pt-3 text-xs">
      <div className="text-muted-foreground">Reported by</div>
      <div className="font-medium">
        {report.reporter.username
          ? `@${report.reporter.username}`
          : report.reporter.email}
      </div>
      {report.reviewer ? (
        <>
          <div className="text-muted-foreground mt-2">Reviewed by</div>
          <div className="font-medium">{report.reviewer.email}</div>
        </>
      ) : null}
    </div>
  )
}
