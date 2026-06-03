import { IssuedTicketsTable } from "@/features/admin/issued-tickets/components/issued-tickets-table"

export default function AdminIssuedTicketsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Issued tickets
        </h1>
        <p className="text-muted-foreground text-sm">
          Reissue, revoke, or transfer individual tickets.
        </p>
      </div>
      <IssuedTicketsTable />
    </div>
  )
}
