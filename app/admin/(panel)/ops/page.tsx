import { OpsDashboard } from "@/features/admin/ops/components/ops-dashboard"

export default function AdminOpsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ops</h1>
        <p className="text-muted-foreground text-sm">
          Health checks, queue state, and allow-listed artisan commands.
        </p>
      </div>
      <OpsDashboard />
    </div>
  )
}
