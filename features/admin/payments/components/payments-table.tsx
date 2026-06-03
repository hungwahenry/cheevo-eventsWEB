"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PaymentStatusBadge } from "@/features/admin/payments/components/payment-status-badge"
import { usePayments } from "@/features/admin/payments/hooks"
import type {
  AdminPayment,
  AdminPaymentStatus,
} from "@/features/admin/payments/types"
import { formatMoney } from "@/lib/format/money"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = AdminPaymentStatus | "all"
type ProviderFilter = "paystack" | "flutterwave" | "all"

export function PaymentsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [provider, setProvider] = useState<ProviderFilter>("all")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [status, provider, search])

  const { data, isLoading, isFetching } = usePayments({
    q: search || undefined,
    status: status === "all" ? undefined : status,
    provider: provider === "all" ? undefined : provider,
    page,
  })

  const columns: DataTableColumn<AdminPayment>[] = [
    {
      id: "ref",
      header: "Reference",
      cell: (p) => (
        <div className="grid gap-0.5">
          <span className="font-mono text-xs">{p.reference}</span>
          {p.provider_reference ? (
            <span className="text-muted-foreground font-mono text-xs">
              ↳ {p.provider_reference}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "provider",
      header: "Provider",
      cell: (p) => <Badge variant="outline">{p.provider}</Badge>,
      cellClassName: "w-32",
    },
    {
      id: "amount",
      header: "Amount",
      cell: (p) => (
        <span className="tabular-nums">
          {formatMoney(p.amount_minor, p.currency)}
        </span>
      ),
      cellClassName: "w-32 text-right",
      headerClassName: "text-right",
    },
    {
      id: "created",
      header: "Created",
      cell: (p) => (
        <span className="text-muted-foreground text-xs">
          {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      cellClassName: "w-28 hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => <PaymentStatusBadge status={p.status} />,
      cellClassName: "w-32",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      isFetching={isFetching}
      page={data?.page}
      lastPage={data?.last_page}
      total={data?.total}
      onPageChange={setPage}
      search={searchInput}
      onSearchChange={setSearchInput}
      searchPlaceholder="Reference or provider reference"
      filters={
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            type="single"
            size="sm"
            value={provider}
            onValueChange={(v) => v && setProvider(v as ProviderFilter)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="paystack">Paystack</ToggleGroupItem>
            <ToggleGroupItem value="flutterwave">Flutterwave</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            size="sm"
            value={status}
            onValueChange={(v) => v && setStatus(v as StatusFilter)}
          >
            <ToggleGroupItem value="all">Any</ToggleGroupItem>
            <ToggleGroupItem value="successful">Successful</ToggleGroupItem>
            <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
            <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
            <ToggleGroupItem value="refunded">Refunded</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
      empty={{ title: "No payments match." }}
      onRowClick={(p) => router.push(`/admin/payments/${p.id}`)}
    />
  )
}
