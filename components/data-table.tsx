"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"
import * as React from "react"

export type DataTableColumn<T> = {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  headerClassName?: string
  cellClassName?: string
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string

  isLoading?: boolean
  isFetching?: boolean

  page?: number
  lastPage?: number
  total?: number
  onPageChange?: (page: number) => void

  search?: string
  onSearchChange?: (q: string) => void
  searchPlaceholder?: string

  filters?: React.ReactNode

  empty?: { title: string; description?: string }
  onRowClick?: (row: T) => void
}

const SKELETON_ROWS = 6

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  isFetching,
  page,
  lastPage,
  total,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  empty,
  onRowClick,
}: DataTableProps<T>) {
  const showToolbar = onSearchChange !== undefined || filters !== undefined

  return (
    <div className="flex flex-col gap-3">
      {showToolbar ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange ? (
            <div className="relative w-full sm:max-w-xs">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8"
              />
            </div>
          ) : (
            <div />
          )}
          {filters ? (
            <div className="flex flex-wrap items-center gap-2">{filters}</div>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card transition-opacity",
          isFetching && !isLoading ? "opacity-70" : ""
        )}>
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  className={cn("text-xs font-medium", col.headerClassName)}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                <TableRow key={`s-${idx}`}>
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.cellClassName}>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center">
                  <p className="text-sm font-medium">
                    {empty?.title ?? "Nothing here yet"}
                  </p>
                  {empty?.description ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {empty.description}
                    </p>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn("text-sm", col.cellClassName)}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {onPageChange && page && lastPage && lastPage > 1 ? (
        <DataTableFooter
          page={page}
          lastPage={lastPage}
          total={total}
          onPageChange={onPageChange}
        />
      ) : total !== undefined && total > 0 ? (
        <p className="text-muted-foreground text-xs">
          {total.toLocaleString()} result{total === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  )
}

function DataTableFooter({
  page,
  lastPage,
  total,
  onPageChange,
}: {
  page: number
  lastPage: number
  total?: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <p className="text-muted-foreground">
        Page {page} of {lastPage}
        {total !== undefined ? ` · ${total.toLocaleString()} total` : ""}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}>
          <ChevronLeftIcon className="size-4" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
