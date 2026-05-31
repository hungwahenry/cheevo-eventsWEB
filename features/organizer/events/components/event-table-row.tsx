"use client"

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
import { TableCell, TableRow } from "@/components/ui/table"
import {
  formatEventStatus,
  formatEventWhen,
} from "@/features/organizer/events/format"
import { useDeleteEvent } from "@/features/organizer/events/hooks"
import type { EventItem } from "@/features/organizer/events/types"
import { formatMoney } from "@/lib/format/money"
import { ImageIcon, MapPinIcon, MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function EventTableRow({ event }: { event: EventItem }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const remove = useDeleteEvent()
  const href = `/organizer/events/${event.id}`
  const editHref = `/organizer/events/${event.id}/edit`
  const when = formatEventWhen(event.starts_at, event.ends_at)

  return (
    <>
      <TableRow className="hover:bg-muted/40">
        <TableCell>
          <Link href={href} className="flex items-center gap-3">
            <div className="relative h-12 w-[2.4rem] shrink-0 overflow-hidden rounded bg-muted">
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
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-3.5" />
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {event.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                /{event.slug}
              </span>
            </div>
          </Link>
        </TableCell>

        <TableCell className="hidden w-56 md:table-cell">
          {event.venue_name || event.city ? (
            <div className="flex items-start gap-1.5 text-sm">
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate">{event.venue_name ?? "—"}</span>
                {event.city ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {event.city}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell className="w-44">
          <div className="flex flex-col text-sm">
            <span>{when.date}</span>
            {when.time ? (
              <span className="text-xs text-muted-foreground">{when.time}</span>
            ) : null}
          </div>
        </TableCell>

        <TableCell className="hidden w-32 text-right text-sm tabular-nums lg:table-cell">
          {event.tickets_sold > 0 ? (
            event.tickets_sold.toLocaleString()
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell className="hidden w-36 text-right text-sm tabular-nums lg:table-cell">
          {event.revenue_minor > 0 ? (
            formatMoney(event.revenue_minor, event.currency)
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell className="w-28">
          <Badge
            variant={event.status === "published" ? "default" : "secondary"}
          >
            {formatEventStatus(event.status)}
          </Badge>
        </TableCell>

        <TableCell className="w-12 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Row actions">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={editHref}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{event.title}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the event and its media. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove.mutate(event.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
