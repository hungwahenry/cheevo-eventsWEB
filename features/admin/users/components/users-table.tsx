"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { displayName } from "@/features/admin/users/format"
import { useUsers } from "@/features/admin/users/hooks"
import type {
  AdminUser,
  AdminUserRole,
} from "@/features/admin/users/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type RoleFilter = AdminUserRole | "all"
type SuspendedFilter = "any" | "yes" | "no"

export function UsersTable() {
  const router = useRouter()
  const [role, setRole] = useState<RoleFilter>("all")
  const [suspended, setSuspended] = useState<SuspendedFilter>("any")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [role, suspended, search])

  const { data, isLoading, isFetching } = useUsers({
    q: search || undefined,
    role: role === "all" ? undefined : role,
    suspended:
      suspended === "any" ? undefined : suspended === "yes" ? true : false,
    page,
  })

  const columns: DataTableColumn<AdminUser>[] = [
    {
      id: "user",
      header: "User",
      cell: (u) => (
        <div className="grid gap-0.5">
          <span className="font-medium">{displayName(u)}</span>
          <span className="text-muted-foreground text-xs">{u.email}</span>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (u) => (
        <Badge variant={u.role === "admin" ? "default" : "outline"}>
          {u.role}
        </Badge>
      ),
      cellClassName: "w-28",
    },
    {
      id: "status",
      header: "Status",
      cell: (u) =>
        u.suspended_at ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        ),
      cellClassName: "w-32",
    },
    {
      id: "city",
      header: "City",
      cell: (u) => (
        <span className="text-muted-foreground text-xs">
          {u.profile?.city ?? "—"}
        </span>
      ),
      cellClassName: "hidden md:table-cell w-40",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-muted-foreground text-xs">
          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "hidden lg:table-cell w-32",
      headerClassName: "hidden lg:table-cell",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(u) => u.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page}
      lastPage={data?.last_page}
      total={data?.total}
      onPageChange={setPage}
      search={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="Search email, username, name…"
      filters={
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            size="sm"
            value={role}
            onValueChange={(v) => v && setRole(v as RoleFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="attendee">Attendee</ToggleGroupItem>
            <ToggleGroupItem value="organiser">Organiser</ToggleGroupItem>
            <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            size="sm"
            value={suspended}
            onValueChange={(v) => v && setSuspended(v as SuspendedFilter)}
          >
            <ToggleGroupItem value="any">Any</ToggleGroupItem>
            <ToggleGroupItem value="no">Active</ToggleGroupItem>
            <ToggleGroupItem value="yes">Suspended</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
      empty={{ title: "No users match." }}
      onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
    />
  )
}
