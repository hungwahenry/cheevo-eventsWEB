import { SearchDashboard } from "@/features/admin/search/components/search-dashboard"

export default function AdminSearchPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="text-muted-foreground text-sm">
          Index coverage and on-demand reindex.
        </p>
      </div>
      <SearchDashboard />
    </div>
  )
}
