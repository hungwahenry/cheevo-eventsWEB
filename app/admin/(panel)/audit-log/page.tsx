import { AuditLogTable } from "@/features/admin/audit-log/components/audit-log-table"

export default function AdminAuditLogPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="text-muted-foreground text-sm">
          Every admin action — who, what, when, target, payload.
        </p>
      </div>
      <AuditLogTable />
    </div>
  )
}
