import { PagesTable } from "@/features/admin/pages/components/pages-table"

export default function AdminPagesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
        <p className="text-muted-foreground text-sm">
          Static content — Terms of Service, Privacy Policy, About, etc.
        </p>
      </div>
      <PagesTable />
    </div>
  )
}
