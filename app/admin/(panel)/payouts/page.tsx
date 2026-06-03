import { PayoutsTable } from "@/features/admin/payouts/components/payouts-table"

export default function AdminPayoutsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="text-muted-foreground text-sm">
          Approve organiser payouts. Approval immediately initiates the
          provider transfer; success/failure arrives via webhook.
        </p>
      </div>
      <PayoutsTable />
    </div>
  )
}
