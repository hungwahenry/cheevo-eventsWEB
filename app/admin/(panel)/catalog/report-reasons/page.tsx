import { ReasonsManager } from "@/features/admin/report-reasons/components/reasons-manager"

export default function AdminReportReasonsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Report reasons</h1>
        <p className="text-muted-foreground text-sm">
          The options users see when reporting events, comments, users, or orgs.
        </p>
      </div>
      <ReasonsManager />
    </div>
  )
}
