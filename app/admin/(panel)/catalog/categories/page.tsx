import { CategoriesManager } from "@/features/admin/organisation-categories/components/categories-manager"

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Organisation categories
        </h1>
        <p className="text-muted-foreground text-sm">
          High-level groupings organisers pick when creating an org.
        </p>
      </div>
      <CategoriesManager />
    </div>
  )
}
