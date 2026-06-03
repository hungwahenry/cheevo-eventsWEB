import { PaymentsTable } from "@/features/admin/payments/components/payments-table"

export default function AdminPaymentsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-muted-foreground text-sm">
          Every payment record. Resync to fetch authoritative status from the
          provider; mark-success for off-platform settlements.
        </p>
      </div>
      <PaymentsTable />
    </div>
  )
}
