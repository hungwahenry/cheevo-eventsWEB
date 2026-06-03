import { UsersTable } from "@/features/admin/users/components/users-table"

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm">
          Every account on the platform. Suspended users can&apos;t hit any
          authenticated endpoint.
        </p>
      </div>
      <UsersTable />
    </div>
  )
}
