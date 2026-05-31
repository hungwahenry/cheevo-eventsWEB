"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  formatEventStatus,
  formatEventWhen,
} from "@/features/organizer/events/format"
import { useDeleteEvent, useEvents } from "@/features/organizer/events/hooks"
import type { EventItem, EventStatus } from "@/features/organizer/events/types"
import { formatMoney } from "@/lib/format/money"
import { ImageIcon, MapPinIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type StatusFilter = EventStatus | "all"

export function EventsTable() {
  const router = useRouter()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null)
  const remove = useDeleteEvent()

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [status, search])

  const { data, isLoading, isFetching } = useEvents(
    page,
    status === "all" ? undefined : status,
    search || undefined
  )

  const columns: DataTableColumn<EventItem>[] = [
    {
      id: "event",
      header: "Event",
      cell: (e) => <EventCell event={e} />,
    },
    {
      id: "location",
      header: "Location",
      cell: (e) => <LocationCell event={e} />,
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell w-56",
    },
    {
      id: "when",
      header: "When",
      cell: (e) => <WhenCell event={e} />,
      cellClassName: "w-44",
    },
    {
      id: "sold",
      header: "Sold",
      cell: (e) =>
        e.tickets_sold > 0 ? (
          <span className="tabular-nums">{e.tickets_sold.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      headerClassName: "hidden lg:table-cell text-right",
      cellClassName: "hidden lg:table-cell w-32 text-right",
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: (e) =>
        e.revenue_minor > 0 ? (
          <span className="tabular-nums">
            {formatMoney(e.revenue_minor, e.currency)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      headerClassName: "hidden lg:table-cell text-right",
      cellClassName: "hidden lg:table-cell w-36 text-right",
    },
    {
      id: "status",
      header: "Status",
      cell: (e) => (
        <Badge variant={e.status === "published" ? "default" : "secondary"}>
          {formatEventStatus(e.status)}
        </Badge>
      ),
      cellClassName: "w-28",
    },
    {
      id: "actions",
      header: "",
      cell: (e) => (
        <div onClick={(ev) => ev.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Row actions">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/organizer/events/${e.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteTarget(e)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cellClassName: "w-12 text-right",
    },
  ]

  return (
    <>
      <DataTable<EventItem>
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(e) => e.id}
        isLoading={isLoading}
        isFetching={isFetching}
        page={data?.page ?? page}
        lastPage={data?.last_page ?? 1}
        total={data?.total}
        onPageChange={setPage}
        search={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search title, slug, venue, city…"
        filters={
          <ToggleGroup
            type="single"
            value={status}
            onValueChange={(v) => v && setStatus(v as StatusFilter)}
            variant="outline"
            size="sm">
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="draft">Drafts</ToggleGroupItem>
            <ToggleGroupItem value="published">Published</ToggleGroupItem>
          </ToggleGroup>
        }
        empty={{
          title: "No events yet",
          description: "Create your first event to get started.",
        }}
        onRowClick={(e) => router.push(`/organizer/events/${e.id}`)}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{deleteTarget?.title}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the event and its media. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) remove.mutate(deleteTarget.id)
                setDeleteTarget(null)
              }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function EventCell({ event }: { event: EventItem }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted relative h-12 w-[2.4rem] shrink-0 overflow-hidden rounded">
        {event.flyer_url ? (
          event.flyer_type === "video" ? (
            <video
              src={`${event.flyer_url}#t=0.1`}
              muted
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <img
              src={event.flyer_url}
              alt=""
              className="size-full object-cover"
            />
          )
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">
            <ImageIcon className="size-3.5" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{event.title}</span>
        <span className="text-muted-foreground truncate text-xs">
          /{event.slug}
        </span>
      </div>
    </div>
  )
}

function LocationCell({ event }: { event: EventItem }) {
  if (!event.venue_name && !event.city) {
    return <span className="text-muted-foreground text-sm">—</span>
  }
  return (
    <div className="flex items-start gap-1.5 text-sm">
      <MapPinIcon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate">{event.venue_name ?? "—"}</span>
        {event.city ? (
          <span className="text-muted-foreground truncate text-xs">
            {event.city}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function WhenCell({ event }: { event: EventItem }) {
  const when = formatEventWhen(event.starts_at, event.ends_at)
  return (
    <div className="flex flex-col text-sm">
      <span>{when.date}</span>
      {when.time ? (
        <span className="text-muted-foreground text-xs">{when.time}</span>
      ) : null}
    </div>
  )
}
