import { OrganisationsTable } from "@/features/admin/organisations/components/organisations-table"

export default function AdminOrganisationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organisations</h1>
        <p className="text-muted-foreground text-sm">
          Suspend, change ownership, or delete organisations.
        </p>
      </div>
      <OrganisationsTable />
    </div>
  )
}
